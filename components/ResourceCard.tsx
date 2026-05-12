export default function ResourceCard({ recurso }: { recurso: any }) {
      return (
              <div className="bg-white border p-6 rounded-2xl shadow-sm h-full flex flex-col">
                    <h3 className="text-xl font-semibold mb-2">{recurso.titulo}</h3>h3>
                    <p className="text-gray-600 text-sm mb-4 flex-grow">{recurso.descripcion}</p>p>
                    <div className="text-xs text-gray-500 mb-4">
                            <div>Materia: {recurso.materia}</div>div>
                            <div>Idioma: {recurso.idioma || 'ES'}</div>div>
                            <div>Fecha: {recurso.fecha || 'N/A'}</div>div>
                    </div>div>
                    <a href={recurso.url_recurso} target="_blank" className="text-blue-600 font-medium">Ver recurso</a>a>
              </div>div>
            );
}
</div>
