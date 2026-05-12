export default function ResourceCard({ recurso }: any) {
      return (
              <div className="bg-white border p-6 rounded-2xl">
                    <h3 className="text-xl font-semibold mb-2">{recurso.titulo}</h3>h3>
                    <p className="text-gray-600 mb-4">{recurso.descripcion}</p>p>
                    <a href={recurso.url_recurso} target="_blank" className="text-blue-600">Ver recurso</a>a>
              </div>div>
            );
}
</div>
