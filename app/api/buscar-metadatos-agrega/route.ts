import { NextResponse } from 'next/server';
import { fetchAgregaMetadata } from '@/lib/agrega';
import { parseOaiXml, normalizeRecords, filterByQuery } from '@/lib/parser';
import { isSupabaseConfigured, supabaseServer } from '@/lib/supabaseServer';
import { validateQuery, sanitizeQuery } from '@/lib/validators';
import { scrapeRedined } from '@/lib/redinedScraper';
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
    const supabase = isSupabaseConfigured() ? supabaseServer : null;

    // 2. Intentar Cache
    if (supabase) {
      const { data: cachedRecords, error: cacheError } = await supabase
        .from('recursos_agrega')
        .select('*')
        .eq('consulta', cleanQuery)
        .order('created_at', { ascending: false });

      if (!cacheError && cachedRecords && cachedRecords.length > 0) {
        return NextResponse.json({
          success: true,
          recursos: cachedRecords as Recurso[],
          total: cachedRecords.length,
          fuente: 'Supabase cache',
        });
      }
    }

    // 3. Obtener resultados (Priorizar Scraper por velocidad en Vercel)
    console.log(`[API] Iniciando scraping para: ${cleanQuery}`);
    let allResults: Recurso[] = await scrapeRedined(cleanQuery);
    let fuente = 'Redined (Web)';

    // 4. Si el scraper no devuelve nada, intentar OAI-PMH (con timeout corto)
    if (allResults.length === 0) {
      try {
        console.log(`[API] Scraper vacío, intentando OAI-PMH...`);
        const xml = await fetchAgregaMetadata(5000); // 5s max
        const parsedXml = parseOaiXml(xml);
        const oaiRecords = normalizeRecords(parsedXml, cleanQuery);
        const filtered = filterByQuery(oaiRecords, cleanQuery);
        if (filtered.length > 0) {
          allResults = filtered;
          fuente = 'Redined (OAI-PMH)';
        }
      } catch (oaiError) {
        console.error('Error en OAI-PMH fallback:', oaiError);
      }
    }

    // 5. Guardar en Cache
    if (allResults.length > 0 && supabase) {
      // Omitimos la lógica de duplicados compleja por ahora para asegurar velocidad
      const { error: dbError } = await supabase
        .from('recursos_agrega')
        .insert(allResults.map((record) => ({
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
          raw_metadata: record.raw_metadata as any,
        })));
      
      if (dbError) console.error('Error cacheando resultados:', dbError);
    }

    return NextResponse.json({ 
      success: true, 
      recursos: allResults,
      total: allResults.length,
      fuente: fuente
    });

  } catch (error: unknown) {
    console.error('Error crítico en API:', error);
    return NextResponse.json({ 
      error: 'Error al procesar la búsqueda educativa.',
      details: error instanceof Error ? error.message : 'Error desconocido',
    }, { status: 500 });
  }
}
