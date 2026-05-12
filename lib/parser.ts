import { XMLParser } from 'fast-xml-parser';
import { Recurso } from '../types/recurso';

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
});

export const parseOaiXml = (xml: string): any => {
  return parser.parse(xml);
};

export const normalizeRecords = (parsedXml: any, consulta: string): Recurso[] => {
  const records = parsedXml?.['OAI-PMH']?.ListRecords?.record;
  
  if (!records) return [];

  const recordList = Array.isArray(records) ? records : [records];
  
  return recordList.map((record: any) => {
    const metadata = record.metadata?.['oai_dc:dc'];
    if (!metadata) return null;

    const titles = extractField(metadata['dc:title']);
    const descriptions = extractField(metadata['dc:description']);
    const subjects = extractField(metadata['dc:subject']);
    const languages = extractField(metadata['dc:language']);
    const dates = extractField(metadata['dc:date']);
    const identifiers = extractField(metadata['dc:identifier']);

    // Intentamos encontrar una URL válida entre los identificadores
    const urlRecurso = identifiers.find((id: string) => id.startsWith('http')) || '';

    return {
      consulta,
      identificador_oai: record.header?.identifier || '',
      titulo: titles[0] || 'Sin título',
      descripcion: descriptions.join(' ') || 'Sin descripción',
      materia: subjects.join(', ') || 'N/A',
      idioma: languages[0] || 'es',
      fecha: dates[0] || 'N/A',
      url_recurso: urlRecurso,
      fuente: 'Agrega',
      endpoint_consultado: 'https://agrega.educacion.es/catalogo/oai/request',
      raw_metadata: record,
    };
  }).filter((r: any): r is Recurso => r !== null);
};

const extractField = (field: any): string[] => {
  if (!field) return [];
  if (Array.isArray(field)) {
    return field.map(f => (typeof f === 'object' ? f['#text'] || '' : f).toString());
  }
  return [(typeof field === 'object' ? field['#text'] || '' : field).toString()];
};

export const filterByQuery = (recursos: Recurso[], query: string): Recurso[] => {
  const q = query.toLowerCase();
  return recursos.filter(r => 
    r.titulo.toLowerCase().includes(q) || 
    r.descripcion.toLowerCase().includes(q) ||
    r.materia.toLowerCase().includes(q)
  );
};
