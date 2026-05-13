import { Recurso } from '@/types/recurso';

interface ResourceCardProps {
  recurso: Recurso;
}

export default function ResourceCard({ recurso }: ResourceCardProps) {
  return (
    <div className="bg-white border p-6 rounded-2xl">
      <h3 className="text-xl font-semibold mb-2">{recurso.titulo}</h3>
      <p className="text-gray-600 mb-4">{recurso.descripcion}</p>
      <a href={recurso.url_recurso} target="_blank" rel="noopener noreferrer" className="text-blue-600">Ver recurso</a>
    </div>
  );
}
