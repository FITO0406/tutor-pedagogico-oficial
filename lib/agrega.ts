import { validateAllowedHost } from './validators';

const AGREGA_ENDPOINT = 'https://redined.educacion.gob.es/oai/request';

export const buildAgregaUrl = (verb: string = 'ListRecords', metadataPrefix: string = 'oai_dc'): string => {
  const url = new URL(AGREGA_ENDPOINT);
  url.searchParams.append('verb', verb);
  url.searchParams.append('metadataPrefix', metadataPrefix);
  return url.toString();
};

export const fetchAgregaMetadata = async (timeout: number = 15000): Promise<string> => {
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
