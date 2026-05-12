-- Ejecuta este script en el SQL Editor de tu proyecto de Supabase

create table recursos_agrega (
  id bigint primary key generated always as identity,
  consulta text,
  identificador_oai text,
  titulo text,
  descripcion text,
  materia text,
  idioma text,
  fecha text,
  url_recurso text,
  fuente text default 'Agrega',
  endpoint_consultado text default 'https://agrega.educacion.es/catalogo/oai/request',
  raw_metadata jsonb,
  created_at timestamp with time zone default now()
);

-- Opcional: Crear un índice para búsquedas rápidas por consulta
create index idx_recursos_agrega_consulta on recursos_agrega(consulta);

-- Opcional: Índice único para evitar duplicados del mismo recurso OAI
-- create unique index idx_recursos_agrega_oai_id on recursos_agrega(identificador_oai);
