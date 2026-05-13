import { NextResponse } from 'next/server';
import { fetchAgregaMetadata } from '@/lib/agrega';
import { parseOaiXml, normalizeRecords, filterByQuery } from '@/lib/parser';
import { isSupabaseConfigured, supabaseServer } from '@/lib/supabaseServer';
import { validateQuery, sanitizeQuery } from '@/lib/validators';
import { Recurso } from '@/types/recurso';

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { consulta?: string };
    const { consulta } = body;

    // 1. Validar consulta
    const validationError = validateQuery(consulta);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const cleanQuery = sanitizeQuery(consulta as string);
    console.log(`[API] Búsqueda iniciada para: "${cleanQuery}"`);
    
    const supabase = isSupabaseConfigured() ? supabaseServer : null;
    console.log(`[API] Supabase configurado: ${!!supabase}`);

    if (supabase) {
      const { data: cachedRecords, error: cacheError } = await supabase
        .from('recursos_agrega')
        .select('*')
        .eq('consulta', cleanQuery)
        .order('created_at', { ascending: false });

      if (cacheError) {
        console.error('Error al consultar la caché en Supabase:', cacheError);
      } else if (cachedRecords && cachedRecords.length > 0) {
        return NextResponse.json({
          success: true,
          recursos: cachedRecords as Recurso[],
          total: cachedRecords.length,
          fuente: 'Supabase cache',
        });
      }
    }

    // 2. Consultar Agrega
    console.log('[API] Consultando repositorio externo...');
    const xml = await fetchAgregaMetadata();
    console.log(`[API] XML recibido (${xml.length} caracteres)`);

    // 3. Parsear y Normalizar
    console.log('[API] Parseando XML...');
    const parsedXml = parseOaiXml(xml);
    console.log('[API] Normalizando registros...');
    const allRecords = normalizeRecords(parsedXml, cleanQuery);
    console.log(`[API] ${allRecords.length} registros normalizados`);

    // 4. Filtrar por la consulta del usuario
    const filteredRecords = filterByQuery(allRecords, cleanQuery);

    if (filteredRecords.length > 0) {
      // 5. Guardar en Supabase (Cache)
      // Usamos upsert para evitar duplicados si el identificador_oai es el mismo (necesitaría índice único)
      // Por ahora, simplemente insertamos los resultados relevantes
      if (supabase) {
        const { data: existingRows, error: existingError } = await supabase
          .from('recursos_agrega')
          .select('identificador_oai')
          .eq('consulta', cleanQuery);

        if (existingError) {
          console.error('Error al consultar registros existentes en Supabase:', existingError);
        } else {
          const existingIds = new Set(
            (existingRows || []).map((row) => row.identificador_oai).filter(Boolean)
          );

          const recordsToInsert = filteredRecords.filter(
            (record) => !existingIds.has(record.identificador_oai)
          );

          if (recordsToInsert.length > 0) {
            const { error: dbError } = await supabase
              .from('recursos_agrega')
              .insert(recordsToInsert.map((record) => ({
                consulta: record.consulta,
                identificador_oai: record.identificador_oai,
                titulo: record.titulo,
                descripcion: record.descripcion,
                materia: record.materia,
                idioma: record.idioma,
                fecha: record.fecha,
                url_recurso: record.url_recurso,
                fuente: record.fuente,
                endpoint_consultado: record.endpoint_consultado,
                raw_metadata: record.raw_metadata,
              })));

            if (dbError) {
              console.error('Error al guardar en Supabase:', dbError);
            }
          }
        }
      }
    }

    return NextResponse.json({ 
      success: true, 
      recursos: filteredRecords,
      total: filteredRecords.length,
      fuente: 'Agrega'
    });

  } catch (error: unknown) {
    console.error('Error en API buscar-metadatos-agrega:', error);
    return NextResponse.json({ 
      error: 'Error interno al procesar la solicitud.',
      details: error instanceof Error ? error.message : 'Error desconocido',
    }, { status: 500 });
  }
}
