# Tutor Pedagógico Oficial

Una aplicación web moderna diseñada para buscar metadatos educativos oficiales directamente desde el repositorio **Agrega (OAI-PMH)**, cachearlos en **Supabase** y mostrarlos en una interfaz limpia y responsive.

## 🚀 Stack Tecnológico

- **Framework:** Next.js 14+ (App Router)
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS
- **Base de Datos:** Supabase (PostgreSQL)
- **Parser:** fast-xml-parser
- **Iconos:** Lucide React
- **Despliegue:** Vercel

## 🛠️ Configuración Local

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/tu-usuario/tutor-pedagogico-oficial.git
   cd tutor-pedagogico-oficial
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Variables de Entorno:**
   Crea un archivo `.env.local` basado en `.env.example` y rellena tus credenciales de Supabase.
   ```bash
   cp .env.example .env.local
   ```

4. **Configurar la Base de Datos:**
   Copia el contenido de `supabase_schema.sql` y ejecútalo en el SQL Editor de tu Dashboard de Supabase.

5. **Ejecutar en desarrollo:**
   ```bash
   npm run dev
   ```

## 🌐 Despliegue en Vercel

1. Sube tu código a GitHub.
2. Conecta tu repositorio en Vercel.
3. Configura las mismas variables de entorno en el panel de Vercel.
4. ¡Listo!

## 🛡️ Seguridad y Políticas

- **Solo Fuentes Oficiales:** La aplicación solo consulta `agrega.educacion.es`. Cualquier otro dominio está bloqueado por validadores internos.
- **Service Role:** La clave `SUPABASE_SERVICE_ROLE_KEY` solo se utiliza en el servidor para evitar exposiciones de seguridad.
- **Sin IA Generativa:** Todos los datos mostrados son metadatos puros recuperados del repositorio oficial.

## 📁 Estructura del Proyecto

- `app/api/`: Endpoint para la lógica de búsqueda y caché.
- `components/`: Componentes de interfaz (SearchBar, ResultsList, etc.).
- `lib/`: Lógica de negocio, validadores y clientes de API.
- `types/`: Definiciones de TypeScript.
- `supabase_schema.sql`: Script de inicialización de DB.

## 📝 Pruebas Recomendadas

Intenta buscar los siguientes términos para verificar el funcionamiento:
- `fracciones`
- `ecosistemas`
- `sintaxis`
- `energía`
- `geometría`
