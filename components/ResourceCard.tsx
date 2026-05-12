export default function ResourceCard({ recurso }: any) {
        return (
                  <div className="bg-white border p-6">
                        <h3>{recurso.titulo}</h3>h3>
                        <p>{recurso.descripcion}</p>p>
                        <a href={recurso.url_recurso} target="_blank">Ver recurso</a>a>
                  </div>div>
                );
}
</div>
