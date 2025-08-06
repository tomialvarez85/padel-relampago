import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { torneoService } from '@/services/torneoService';
import toast from 'react-hot-toast';

const TorneoDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: torneo, isLoading, error } = useQuery({
    queryKey: ['torneo', id],
    queryFn: () => torneoService.getTorneoById(id!),
    enabled: !!id,
  });

  const deleteTorneoMutation = useMutation({
    mutationFn: torneoService.deleteTorneo,
    onSuccess: () => {
      toast.success('Torneo eliminado exitosamente');
      queryClient.invalidateQueries({ queryKey: ['torneos'] });
      navigate('/torneos');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Error al eliminar el torneo');
    },
  });

  const changeStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => 
      torneoService.changeStatus(id, status),
    onSuccess: () => {
      toast.success('Estado del torneo actualizado');
      queryClient.invalidateQueries({ queryKey: ['torneo', id] });
      queryClient.invalidateQueries({ queryKey: ['torneos'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Error al actualizar el estado');
    },
  });

  const handleDelete = () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este torneo?')) {
      deleteTorneoMutation.mutate(id!);
    }
  };

  const handleStatusChange = (newStatus: string) => {
    changeStatusMutation.mutate({ id: id!, status: newStatus });
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

  const getFormatText = (format: string) => {
    switch (format) {
      case 'SINGLE_ELIMINATION':
        return 'Eliminación Simple';
      case 'DOUBLE_ELIMINATION':
        return 'Eliminación Doble';
      case 'ROUND_ROBIN':
        return 'Liga';
      case 'SWISS_SYSTEM':
        return 'Sistema Suizo';
      default:
        return format;
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Cargando torneo...</p>
      </div>
    );
  }

  if (error || !torneo) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error al cargar el torneo</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{torneo.name}</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => navigate('/torneos')}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Volver
          </button>
          <button
            onClick={handleDelete}
            disabled={deleteTorneoMutation.isPending}
            className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50"
          >
            {deleteTorneoMutation.isPending ? 'Eliminando...' : 'Eliminar'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Información Principal */}
        <div className="lg:col-span-2">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Información del Torneo</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Descripción</label>
                <p className="mt-1 text-sm text-gray-900">
                  {torneo.description || 'Sin descripción'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Fecha de Inicio</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(torneo.startDate).toLocaleString()}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Fecha de Fin</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(torneo.endDate).toLocaleString()}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Máximo de Equipos</label>
                  <p className="mt-1 text-sm text-gray-900">{torneo.maxTeams}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Formato</label>
                  <p className="mt-1 text-sm text-gray-900">{getFormatText(torneo.format)}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Estado</label>
                <div className="mt-1">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(torneo.status)}`}>
                    {getStatusText(torneo.status)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Panel Lateral */}
        <div className="space-y-6">
          {/* Estadísticas */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Estadísticas</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Equipos Registrados</span>
                <span className="text-sm font-medium text-gray-900">
                  {torneo._count?.teams || 0} / {torneo.maxTeams}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Partidos Programados</span>
                <span className="text-sm font-medium text-gray-900">
                  {torneo._count?.matches || 0}
                </span>
              </div>
            </div>
          </div>

          {/* Cambiar Estado */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Cambiar Estado</h3>
            <div className="space-y-2">
              {['DRAFT', 'REGISTRATION', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'].map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusChange(status)}
                  disabled={changeStatusMutation.isPending || torneo.status === status}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                    torneo.status === status
                      ? 'bg-indigo-100 text-indigo-800 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  } disabled:opacity-50`}
                >
                  {getStatusText(status)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TorneoDetailPage; 