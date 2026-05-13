export type JsonValue =
  | string
  | number
  | boolean
  | null
  | { [key: string]: JsonValue }
  | JsonValue[];

export interface Recurso {
  id?: number;
  consulta?: string;
  identificador_oai: string;
  titulo: string;
  descripcion: string;
  materia: string;
  idioma: string;
  fecha: string;
  url_recurso: string;
  fuente: string;
  endpoint_consultado: string;
  raw_metadata: JsonValue;
  created_at?: string;
}

export interface AgregaResponse {
    recursos: Recurso[];
    total: number;
}
