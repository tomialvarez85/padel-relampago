import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { torneoService } from '@/services/torneoService'
import { Torneo } from '@/types'

const DashboardPage = () => {
  const { data: torneosData } = useQuery({
    queryKey: ['torneos'],
    queryFn: () => torneoService.getTorneos(1, 100),
  });

  const { data: activeTorneos } = useQuery({
    queryKey: ['active-torneos'],
    queryFn: () => torneoService.getActiveTorneos(),
  });

  const totalTorneos = torneosData?.torneos?.length || 0;
  const activeTorneosCount = activeTorneos?.length || 0;
  const totalTeams = torneosData?.torneos?.reduce((sum: number, t: Torneo) => sum + (t._count?.teams || 0), 0) || 0;
  const totalMatches = torneosData?.torneos?.reduce((sum: number, t: Torneo) => sum + (t._count?.matches || 0), 0) || 0;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Panel de Control</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Total de Torneos</h3>
          <p className="text-3xl font-bold text-indigo-600">{totalTorneos}</p>
          <p className="text-sm text-gray-500">Torneos creados</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Torneos Activos</h3>
          <p className="text-3xl font-bold text-green-600">{activeTorneosCount}</p>
          <p className="text-sm text-gray-500">En inscripciones o progreso</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Total de Equipos</h3>
          <p className="text-3xl font-bold text-blue-600">{totalTeams}</p>
          <p className="text-sm text-gray-500">Equipos registrados</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Partidos Programados</h3>
          <p className="text-3xl font-bold text-purple-600">{totalMatches}</p>
          <p className="text-sm text-gray-500">Partidos creados</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Acciones Rápidas</h2>
        <div className="space-y-4">
          <Link
            to="/torneos/create"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Crear Nuevo Torneo
          </Link>
          <div className="ml-4">
            <Link
              to="/torneos"
              className="text-indigo-600 hover:text-indigo-500 text-sm font-medium"
            >
              Ver todos los torneos →
            </Link>
          </div>
        </div>
      </div>

      {activeTorneos && activeTorneos.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow mt-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Torneos Activos</h2>
          <div className="space-y-3">
            {activeTorneos.slice(0, 3).map((torneo: Torneo) => (
              <div key={torneo.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">{torneo.name}</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(torneo.startDate).toLocaleDateString()} - {new Date(torneo.endDate).toLocaleDateString()}
                  </p>
                </div>
                <Link
                  to={`/torneos/${torneo.id}`}
                  className="text-indigo-600 hover:text-indigo-500 text-sm font-medium"
                >
                  Ver detalles →
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default DashboardPage 