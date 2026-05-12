export const validateQuery = (query: string): string | null => {
  if (!query || query.trim().length === 0) {
    return "La consulta no puede estar vacía.";
  }
  
  if (query.length > 100) {
    return "La consulta es demasiado larga (máximo 100 caracteres).";
  }

  return null;
};

export const sanitizeQuery = (query: string): string => {
  // Eliminamos caracteres potencialmente peligrosos o innecesarios
  return query.replace(/[<>]/g, '').trim();
};

export const ALLOWED_HOSTS = ['agrega.educacion.es'];

export const validateAllowedHost = (url: string): boolean => {
  try {
    const parsedUrl = new URL(url);
    return ALLOWED_HOSTS.includes(parsedUrl.hostname);
  } catch {
    return false;
  }
};
