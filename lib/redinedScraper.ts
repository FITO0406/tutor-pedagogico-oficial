import * as cheerio from 'cheerio';
import { Recurso } from '@/types/recurso';

const REDINED_BASE_URL = 'https://redined.educacion.gob.es';

export async function scrapeRedined(query: string): Promise<Recurso[]> {
  const searchUrl = `${REDINED_BASE_URL}/xmlui/discover?query=${encodeURIComponent(query)}&submit=Ir`;
  
  try {
    const response = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      next: { revalidate: 3600 } // Cache results for 1 hour
    });

    if (!response.ok) {
      throw new Error(`Error al acceder a Redined: ${response.statusText}`);
    }

    const html = await response.text();
    console.log(`[Scraper] HTML length: ${html.length}`);
    console.log(`[Scraper] HTML snippet: ${html.substring(0, 500)}`);
    const $ = cheerio.load(html);
    const resources: Recurso[] = [];

    $('.ds-artifact-item').each((_, element) => {
      const titleElement = $(element).find('.artifact-title a');
      const title = titleElement.text().trim();
      const relativeUrl = titleElement.attr('href') || '';
      const url = relativeUrl ? `${REDINED_BASE_URL}${relativeUrl}` : '';
      
      const info = $(element).find('.artifact-info').text().trim();
      // Info suele ser "Autor (Año)" o similar
      const yearMatch = info.match(/\((\d{4})\)/);
      const fecha = yearMatch ? yearMatch[1] : '';
      const autor = info.split('(')[0].trim();

      const abstract = $(element).find('.artifact-abstract').text().trim();

      if (title && url) {
        resources.push({
          consulta: query,
          identificador_oai: url, // Usamos la URL como ID
          titulo: title,
          descripcion: abstract || `Recurso de Redined. ${info}`,
          materia: 'Educación',
          idioma: 'es',
          fecha: fecha || 'N/A',
          url_recurso: url,
          fuente: 'Redined',
          endpoint_consultado: searchUrl,
          raw_metadata: { author: autor, source: 'Web Scraping' }
        });
      }
    });

    return resources;
  } catch (error) {
    console.error('Error in scrapeRedined:', error);
    return [];
  }
}
