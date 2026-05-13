'use client';

import { useState } from 'react';
import { Database, Info, ShieldCheck } from 'lucide-react';
import EmptyState from '@/components/EmptyState';
import ErrorState from '@/components/ErrorState';
import LoadingState from '@/components/LoadingState';
import ResultsList from '@/components/ResultsList';
import SearchBar from '@/components/SearchBar';
import { Recurso } from '@/types/recurso';

export default function Home() {
  const [recursos, setRecursos] = useState<Recurso[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const response = await fetch('/api/buscar-metadatos-agrega', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ consulta: query }),
      });

      const data = (await response.json()) as { error?: string; recursos?: Recurso[] };

      if (!response.ok) {
        throw new Error(data.error || 'Error al conectar con la fuente oficial.');
      }

      setRecursos(data.recursos || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error inesperado.');
      setRecursos([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FAFAFA] text-gray-900">
      <section className="pt-20 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-green-50 text-green-700 rounded-full border border-green-100 text-xs font-medium mb-4">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Acceso a repositorios oficiales</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-gray-900">
            Tutor Pedagogico <span className="text-blue-600">Oficial</span>
          </h1>

          <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Busca y explora metadatos educativos oficiales directamente desde los catálogos{' '}
            <span className="font-semibold text-gray-700">Agrega y Redined</span>. Información veraz
            para docentes y alumnos.
          </p>

          <div className="pt-8">
            <SearchBar onSearch={handleSearch} isLoading={isLoading} />
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 pb-20">
        {isLoading && <LoadingState />}
        {error && <ErrorState message={error} />}
        {!isLoading && !error && hasSearched && recursos.length === 0 && <EmptyState />}

        {!isLoading && !error && recursos.length > 0 && (
          <div className="space-y-8">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider flex items-center">
                <Database className="w-4 h-4 mr-2" />
                Resultados encontrados ({recursos.length})
              </h2>
            </div>
            <ResultsList recursos={recursos} />
          </div>
        )}

        {!hasSearched && (
          <div className="grid md:grid-cols-3 gap-8 mt-12 animate-in fade-in duration-1000">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4">
                <Info className="w-6 h-6" />
              </div>
              <h3 className="font-semibold mb-2">Fuente oficial</h3>
              <p className="text-sm text-gray-500">
                Consulta exclusiva a servidores oficiales (Agrega, Redined, Procomún).
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-semibold mb-2">Sin intervenciones</h3>
              <p className="text-sm text-gray-500">
                No se utiliza IA generativa, Wikipedia ni fuentes externas no oficiales.
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-4">
                <Database className="w-6 h-6" />
              </div>
              <h3 className="font-semibold mb-2">Cache inteligente</h3>
              <p className="text-sm text-gray-500">
                Si Supabase esta configurado, se reutilizan resultados anteriores para acelerar
                las busquedas.
              </p>
            </div>
          </div>
        )}
      </section>

      <footer className="py-12 border-t border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-gray-400">
            Copyright 2026 Tutor Pedagogico Oficial. Conectando con la educacion publica.
          </p>
        </div>
      </footer>
    </main>
  );
}
