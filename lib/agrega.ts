import { validateAllowedHost } from './validators';

const AGREGA_ENDPOINT = 'https://redined.educacion.gob.es/oai/request';

export const buildAgregaUrl = (verb: string = 'ListRecords', metadataPrefix: string = 'oai_dc'): string => {
  const url = new URL(AGREGA_ENDPOINT);
  url.searchParams.append('verb', verb);
  url.searchParams.append('metadataPrefix', metadataPrefix);
  // Usar el set de Recursos Educativos y una fecha de inicio para optimizar la velocidad
  // Esto evita escaneos completos de la base de datos de Redined que causan timeouts
  url.searchParams.append('set', 'com_11162_3'); 
  url.searchParams.append('from', '2015-01-01'); 
  return url.toString();
};

export const fetchAgregaMetadata = async (timeout: number = 9500): Promise<string> => {
  const url = buildAgregaUrl();
  
  if (!validateAllowedHost(url)) {
    throw new Error('URL no autorizada');
  }

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/xml',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });

    if (!response.ok) {
      throw new Error(`Error en la respuesta de Agrega: ${response.statusText}`);
    }

    const xml = await response.text();
    return xml;
  } finally {
    clearTimeout(id);
  }
};
