import { ExternalLink, BookOpen, Globe, Calendar, Tag } from 'lucide-react';

export default function ResourceCard({ recurso }: { recurso: any }) {
    return (
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-semibold text-gray-900 line-clamp-2 leading-tight">
                          {recurso.titulo}
                        </h3>h3>
                        <span className="bg-blue-50 text-blue-600 text-xs font-medium px-2.5 py-1 rounded-full border border-blue-100 flex items-center shrink-0 ml-2">
                                  <Tag className="w-3 h-3 mr-1" />
                          {recurso.fuente}
                        </span>span>
                </div>div>
          
                <p className="text-gray-600 text-sm mb-6 line-clamp-3 flex-grow">
                  {recurso.descripcion}
                </p>p>
          
                <div className="space-y-2 mb-6">
                        <div className="flex items-center text-xs text-gray-500">
                                  <BookOpen className="w-4 h-4 mr-2 text-gray-400" />
                                  <span className="truncate">{recurso.materia}</span>span>
                        </div>div>
                        <div className="flex items-center text-xs text-gray-500">
                                  <Globe className="w-4 h-4 mr-2 text-gray-400" />
                                  <span>{recurso.idioma?.toUpperCase() || 'ES'}</span>span>
                        </div>div>
                        <di</div>
