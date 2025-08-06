import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { torneoService } from '@/services/torneoService';
import { Torneo } from '@/types';
import toast from 'react-hot-toast';

const TorneosPage = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const { data, isLoading, error } = useQuery({
    queryKey: ['torneos', page, search, statusFilter],
    queryFn: () => torneoService.getTorneos(page, 10, search, statusFilter),
  });

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este torneo?')) {
      try {
        await torneoService.deleteTorneo(id);
        toast.success('Torneo eliminado exitosamente');
        // Refetch the data
        window.location.reload();
      } catch (error: any) {
        toast.error(error.response?.data?.error || 'Error al eliminar el torneo');
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DRAFT':
        return 'bg-gray-100 text-gray-800';
      case 'REGISTRATION':
        return 'bg-blue-100 text-blue-800';
      case 'IN_PROGRESS':
        return 'bg-yellow-100 text-yellow-800';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'DRAFT':
        return 'Borrador';
      case 'REGISTRATION':
        return 'Inscripciones';
      case 'IN_PROGRESS':
        return 'En Progreso';
      case 'COMPLETED':
        return 'Completado';
      case 'CANCELLED':
        return 'Cancelado';
      default:
        return status;
    }
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error al cargar los torneos</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Torneos</h1>
        <Link
          to="/torneos/create"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Crear Torneo
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Buscar
            </label>
            <input
              type="text"
              id="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar torneos..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Estado
            </label>
            <select
              id="status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Todos los estados</option>
              <option value="DRAFT">Borrador</option>
              <option value="REGISTRATION">Inscripciones</option>
              <option value="IN_PROGRESS">En Progreso</option>
              <option value="COMPLETED">Completado</option>
              <option value="CANCELLED">Cancelado</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tournaments List */}
      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Cargando torneos...</p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          {data?.torneos && data.torneos.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {data.torneos.map((torneo: Torneo) => (
                <li key={torneo.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">{torneo.name}</h3>
                          <p className="text-sm text-gray-500 mt-1">{torneo.description}</p>
                          <div className="flex items-center mt-2 space-x-4 text-sm text-gray-500">
                            <span>
                              {new Date(torneo.startDate).toLocaleDateString()} - {new Date(torneo.endDate).toLocaleDateString()}
                            </span>
                            <span>Máx: {torneo.maxTeams} equipos</span>
                            <span>{torneo._count?.teams || 0} equipos registrados</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(torneo.status)}`}>
                            {getStatusText(torneo.status)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <Link
                        to={`/torneos/${torneo.id}`}
                        className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                      >
                        Ver detalles
                      </Link>
                      <button
                        onClick={() => handleDelete(torneo.id)}
                        className="text-red-600 hover:text-red-900 text-sm font-medium"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No se encontraron torneos</p>
            </div>
          )}
        </div>
      )}

      {/* Pagination */}
      {data?.pagination && data.pagination.totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <nav className="flex items-center space-x-2">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            <span className="px-3 py-2 text-sm text-gray-700">
              Página {page} de {data.pagination.totalPages}
            </span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page === data.pagination.totalPages}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Siguiente
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default TorneosPage; 