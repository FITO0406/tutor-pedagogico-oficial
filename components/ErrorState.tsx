import { AlertCircle } from 'lucide-react';

interface ErrorStateProps {
  message: string;
}

export default function ErrorState({ message }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center bg-red-50/50 rounded-3xl border border-dashed border-red-200">
      <div className="bg-white p-4 rounded-2xl shadow-sm mb-4">
        <AlertCircle className="w-10 h-10 text-red-500" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        Ha ocurrido un error
      </h3>
      <p className="text-red-600 max-w-xs mx-auto mb-4">
        {message}
      </p>
      <button 
        onClick={() => window.location.reload()}
        className="text-sm font-medium text-gray-600 hover:text-gray-900 underline underline-offset-4"
      >
        Reintentar búsqueda
      </button>
    </div>
  );
}
