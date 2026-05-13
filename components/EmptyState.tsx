import { SearchX } from 'lucide-react';

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center bg-gray-50/50 rounded-3xl border border-dashed border-gray-200">
      <div className="bg-white p-4 rounded-2xl shadow-sm mb-4">
        <SearchX className="w-10 h-10 text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">Sin resultados</h3>
      <p className="text-gray-500 max-w-xs mx-auto">
        No hemos encontrado metadatos oficiales para esta consulta en Agrega. Intenta con otros
        terminos.
      </p>
    </div>
  );
}
