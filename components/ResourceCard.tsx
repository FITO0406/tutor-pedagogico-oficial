import { Recurso } from '@/types/recurso';
import { ExternalLink, BookOpen, Globe, Calendar, Tag } from 'lucide-react';

interface ResourceCardProps {
  recurso: Recurso;
}

export default function ResourceCard({ recurso }: ResourceCardProps) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col h-full">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-gray-900 line-clamp-2 leading-tight">
          {recurso.titulo}
        </h3>
        <span className="bg-blue-50 text-blue-600 text-xs font-medium px-2.5 py-1 rounded-full border border-blue-100 flex items-center shrink-0 ml-2">
          <Tag className="w-3 h-3 mr-1" />
          {recurso.fuente}
        </span>
      </div>

      <p className="text-gray-600 text-sm mb-6 line-clamp-3 flex-grow">
        {recurso.descripcion}
      </p>

      <div className="space-y-2 mb-6">
        <div className="flex items-center text-xs text-gray-500">
          <BookOpen className="w-4 h-4 mr-2 text-gray-400" />
          <span className="truncate">{recurso.materia}</span>
        </div>
        <div className="flex items-center text-xs text-gray-500">
          <Globe className="w-4 h-4 mr-2 text-gray-400" />
          <<span>{recurso.idioma?.toUpperCase() || 'ES'}</span>span></span>
        </div>
        <div className="flex items-center text-xs text-gray-500">
          <Calendar className="w-4 h-4 mr-2 text-gray-400" />
          <span>{recurso.fecha}</span>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-50 flex items-center justify-between mt-auto">
        <span className="text-[10px] text-gray-400 font-mono truncate max-w-[150px]">
          ID: {recurso.identificador_oai}
        </span>
        
        {recurso.url_recurso && (
          <a
            href={recurso.url_recurso}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
          >
            Ver Recurso
            <ExternalLink className="w-4 h-4 ml-1" />
          </a>
        )}
      </div>
    </div>
  );
}
