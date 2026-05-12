import { NextResponse } from 'next/server';
import { fetchAgregaMetadata } from '@/lib/agrega';
import { parseOaiXml, normalizeRecords, filterByQuery } from '@/lib/parser';
import { supabaseServer } from '@/lib/supabaseServer';
import { validateQuery, sanitizeQuery } from '@/lib/validators';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { consulta } = body;

    // 1. Validar consulta
    const validationError = validateQuery(consulta);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const cleanQuery = sanitizeQuery(consulta);

    // 2. Consultar Agrega
    const xml = await fetchAgregaMetadata();

    // 3. Parsear y Normalizar
    const parsedXml = parseOaiXml(xml);
    const allRecords = normalizeRecords(parsedXml, cleanQuery);

    // 4. Filtrar por la consulta del usuario
    const filteredRecords = filterByQuery(allRecords, cleanQuery);

    if (filteredRecords.length > 0) {
      // 5. Guardar en Supabase (Cache)
      // Usamos upsert para evitar duplicados si el identificador_oai es el mismo (necesitaría índice único)
      // Por ahora, simplemente insertamos los resultados relevantes
      const { error: dbError } = await supabaseServer
        .from('recursos_agrega')
        .insert(filteredRecords.map(r => ({
          consulta: r.consulta,
          identificador_oai: r.identificador_oai,
          titulo: r.titulo,
          descripcion: r.descripcion,
          materia: r.materia,
          idioma: r.idioma,
          fecha: r.fecha,
          url_recurso: r.url_recurso,
          fuente: r.fuente,
          endpoint_consultado: r.endpoint_consultado,
          raw_metadata: r.raw_metadata
        })));

      if (dbError) {
        console.error('Error al guardar en Supabase:', dbError);
        // Continuamos aunque falle el guardado en la DB
      }
    }

    return NextResponse.json({ 
      success: true, 
      recursos: filteredRecords,
      total: filteredRecords.length,
      fuente: 'Agrega'
    });

  } catch (error: any) {
    console.error('Error en API buscar-metadatos-agrega:', error);
    return NextResponse.json({ 
      error: 'Error interno al procesar la solicitud.',
      details: error.message 
    }, { status: 500 });
  }
}
