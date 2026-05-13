import { ExternalLink, Calendar, BookOpen, Globe, FileText, MessageSquareQuote } from 'lucide-react';
import { Recurso } from '@/types/recurso';

interface ResourceCardProps {
  recurso: Recurso;
  onOpenTutor: () => void;
}

export default function ResourceCard({ recurso, onOpenTutor }: ResourceCardProps) {
  return (
    <div className="group bg-white border border-gray-100 p-6 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2.5 bg-blue-50 text-blue-600 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
          <BookOpen className="w-5 h-5" />
        </div>
        <div className="flex space-x-2">
          {recurso.idioma && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-50 text-gray-600 border border-gray-100">
              <Globe className="w-3 h-3 mr-1" />
              {recurso.idioma.toUpperCase()}
            </span>
          )}
          {recurso.fecha && recurso.fecha !== 'N/A' && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-50 text-gray-600 border border-gray-100">
              <Calendar className="w-3 h-3 mr-1" />
              {recurso.fecha}
            </span>
          )}
        </div>
      </div>

      <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight group-hover:text-blue-600 transition-colors">
        {recurso.titulo}
      </h3>

      <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-3">
        {recurso.descripcion}
      </p>

      <div className="flex flex-wrap gap-2 mb-6 min-h-[32px]">
        {recurso.materia && recurso.materia !== 'N/A' ? (
          recurso.materia.split(',').slice(0, 3).map((tag, i) => (
            <span key={i} className="text-[10px] uppercase tracking-wider font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-md">
              {tag.trim()}
            </span>
          ))
        ) : (
          <span className="text-[10px] uppercase tracking-wider font-bold text-gray-300 bg-gray-50 px-2 py-1 rounded-md">
            Recurso Pedagógico
          </span>
        )}
      </div>

      <div className="flex flex-col space-y-3 pt-4 border-t border-gray-50">
        <button 
          onClick={onOpenTutor}
          className="w-full inline-flex items-center justify-center px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200"
        >
          <MessageSquareQuote className="w-4 h-4 mr-2" />
          Consultar al Tutor
        </button>

        <div className="flex items-center justify-between">
          <div className="flex items-center text-[10px] text-gray-400 font-medium uppercase tracking-tighter">
            <FileText className="w-3.5 h-3.5 mr-1" />
            <span>{recurso.fuente}</span>
          </div>
          
          <a 
            href={recurso.url_recurso} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex items-center text-xs font-bold text-blue-600 hover:text-blue-700"
          >
            Ver original
            <ExternalLink className="w-3.5 h-3.5 ml-1" />
          </a>
        </div>
      </div>
    </div>
  );
}
