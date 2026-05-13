import { XMLParser } from 'fast-xml-parser';
import { JsonValue, Recurso } from '../types/recurso';

type XmlScalar = string | number | boolean;
type XmlNode = XmlScalar | { [key: string]: XmlNode } | XmlNode[];

interface OaiDcMetadata {
  'dc:title'?: XmlNode;
  'dc:description'?: XmlNode;
  'dc:subject'?: XmlNode;
  'dc:language'?: XmlNode;
  'dc:date'?: XmlNode;
  'dc:identifier'?: XmlNode;
}

interface OaiRecord {
  header?: {
    identifier?: string;
  };
  metadata?: {
    'oai_dc:dc'?: OaiDcMetadata;
  };
}

interface ParsedOaiXml {
  'OAI-PMH'?: {
    ListRecords?: {
      record?: OaiRecord | OaiRecord[];
    };
  };
}

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
});

export const parseOaiXml = (xml: string): ParsedOaiXml =>
  parser.parse(xml) as ParsedOaiXml;

export const normalizeRecords = (parsedXml: ParsedOaiXml, consulta: string): Recurso[] => {
  const records = parsedXml?.['OAI-PMH']?.ListRecords?.record;

  if (!records) return [];

  const recordList = Array.isArray(records) ? records : [records];

  const normalizedRecords = recordList
    .map((record): Recurso | null => {
      const metadata = record.metadata?.['oai_dc:dc'];
      if (!metadata) return null;

      const titles = extractField(metadata['dc:title']);
      const descriptions = extractField(metadata['dc:description']);
      const subjects = extractField(metadata['dc:subject']);
      const languages = extractField(metadata['dc:language']);
      const dates = extractField(metadata['dc:date']);
      const identifiers = extractField(metadata['dc:identifier']);

      // Priorizar URLs que terminen en .pdf o que parezcan enlaces directos
      const pdfUrl = identifiers.find((id) => id.startsWith('http') && id.toLowerCase().endsWith('.pdf'));
      const handleUrl = identifiers.find((id) => id.includes('hdl.handle.net'));
      const anyUrl = identifiers.find((id) => id.startsWith('http'));
      
      const urlRecurso = pdfUrl || handleUrl || anyUrl || '';

      return {
        consulta,
        identificador_oai: record.header?.identifier || '',
        titulo: titles[0] || 'Sin título',
        descripcion: descriptions.length > 1 
          ? descriptions.find(d => d.length > 50) || descriptions[0] 
          : descriptions[0] || 'Sin descripción',
        materia: subjects.join(', ') || 'N/A',
        idioma: languages[0] || 'es',
        fecha: dates[0] || 'N/A',
        url_recurso: urlRecurso,
        fuente: 'Redined / Agrega',
        endpoint_consultado: 'https://redined.educacion.gob.es/oai/request',
        raw_metadata: record as JsonValue,
      };
    })
    .filter((record): record is Recurso => record !== null);

  return normalizedRecords;
};

const extractField = (field?: XmlNode): string[] => {
  if (!field) return [];

  if (Array.isArray(field)) {
    return field
      .map((entry) => normalizeXmlValue(entry))
      .filter((value) => value.length > 0);
  }

  const value = normalizeXmlValue(field);
  return value ? [value] : [];
};

export const filterByQuery = (recursos: Recurso[], query: string): Recurso[] => {
  const normalizedQuery = query.toLowerCase();

  return recursos.filter((recurso) =>
    recurso.titulo.toLowerCase().includes(normalizedQuery) ||
    recurso.descripcion.toLowerCase().includes(normalizedQuery) ||
    recurso.materia.toLowerCase().includes(normalizedQuery)
  );
};

const normalizeXmlValue = (value: XmlNode): string => {
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }

  if (Array.isArray(value)) {
    return value.map((entry) => normalizeXmlValue(entry)).join(' ').trim();
  }

  const textValue = value['#text'];
  if (
    typeof textValue === 'string' ||
    typeof textValue === 'number' ||
    typeof textValue === 'boolean'
  ) {
    return String(textValue);
  }

  return '';
};
