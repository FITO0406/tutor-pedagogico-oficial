import * as cheerio from 'cheerio';
import { Recurso } from '@/types/recurso';

const REDINED_BASE_URL = 'https://redined.educacion.gob.es';

export async function scrapeRedined(query: string): Promise<Recurso[]> {
  const searchUrl = `${REDINED_BASE_URL}/xmlui/discover?query=${encodeURIComponent(query)}&submit=Ir`;
  
  try {
    console.log(`[Scraper] Fetching: ${searchUrl}`);
    const response = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error(`Error al acceder a Redined: ${response.statusText}`);
    }

    const html = await response.text();
    console.log(`[Scraper] HTML received. Size: ${html.length}`);
    
    const $ = cheerio.load(html);
    const resources: Recurso[] = [];

    // Intentar varios selectores comunes en DSpace
    const items = $('.ds-artifact-item, .artifact-description, .ds-artifact-item-container');
    console.log(`[Scraper] Found ${items.length} potential items with selectors`);

    items.each((_, element) => {
      const titleElement = $(element).find('.artifact-title a, h4 a, .ds-artifact-title a');
      const title = titleElement.text().trim();
      const relativeUrl = titleElement.attr('href') || '';
      
      if (title && relativeUrl) {
        const url = relativeUrl.startsWith('http') ? relativeUrl : `${REDINED_BASE_URL}${relativeUrl}`;
        const info = $(element).find('.artifact-info, .author, .date').text().trim();
        const yearMatch = info.match(/\((\d{4})\)/) || info.match(/\b(19|20)\d{2}\b/);
        const fecha = yearMatch ? yearMatch[0].replace(/[()]/g, '') : 'N/A';
        const abstract = $(element).find('.artifact-abstract, .abstract').text().trim();

        resources.push({
          consulta: query,
          identificador_oai: url,
          titulo: title,
          descripcion: abstract || `Recurso de Redined. ${info}`,
          materia: 'Educación',
          idioma: 'es',
          fecha: fecha,
          url_recurso: url,
          fuente: 'Redined',
          endpoint_consultado: searchUrl,
          raw_metadata: { source: 'Web Scraping' }
        });
      }
    });

    // Fallback: Regex simple si los selectores fallan
    if (resources.length === 0) {
      console.log('[Scraper] No items found with Cheerio, trying Regex fallback...');
      const titleRegex = /<h4 class="artifact-title">[\s\S]*?<a href="([^"]+)">([\s\S]*?)<\/a>/g;
      let match;
      while ((match = titleRegex.exec(html)) !== null && resources.length < 10) {
        const url = match[1].startsWith('http') ? match[1] : `${REDINED_BASE_URL}${match[1]}`;
        resources.push({
          consulta: query,
          identificador_oai: url,
          titulo: match[2].trim(),
          descripcion: 'Recurso educativo oficial de Redined.',
          materia: 'Educación',
          idioma: 'es',
          fecha: 'N/A',
          url_recurso: url,
          fuente: 'Redined',
          endpoint_consultado: searchUrl,
          raw_metadata: { source: 'Regex Fallback' }
        });
      }
    }

    console.log(`[Scraper] Returning ${resources.length} resources`);
    return resources;
  } catch (error) {
    console.error('Error in scrapeRedined:', error);
    return [];
  }
}
