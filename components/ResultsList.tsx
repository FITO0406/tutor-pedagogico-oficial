'use client';

import { useState } from 'react';
import { Recurso } from '@/types/recurso';
import ResourceCard from './ResourceCard';
import ChatTutor from './ChatTutor';

interface ResultsListProps {
  recursos: Recurso[];
}

export default function ResultsList({ recursos }: ResultsListProps) {
  const [selectedRecurso, setSelectedRecurso] = useState<Recurso | null>(null);

  if (recursos.length === 0) return null;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {recursos.map((recurso, index) => (
          <ResourceCard 
            key={`${recurso.identificador_oai}-${index}`} 
            recurso={recurso} 
            onOpenTutor={() => setSelectedRecurso(recurso)}
          />
        ))}
      </div>

      {selectedRecurso && (
        <ChatTutor 
          recurso={selectedRecurso} 
          isOpen={!!selectedRecurso} 
          onClose={() => setSelectedRecurso(null)} 
        />
      )}
    </>
  );
}
