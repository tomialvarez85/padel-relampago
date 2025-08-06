import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { torneoService } from '@/services/torneoService';
import { teamService } from '@/services/teamService';
import { bracketService } from '@/services/bracketService';
import AddTeamModal from '@/components/AddTeamModal';
import GroupConfigModal from '@/components/GroupConfigModal';
import toast from 'react-hot-toast';

const TorneoDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showAddTeamModal, setShowAddTeamModal] = useState(false);
  const [showGroupConfigModal, setShowGroupConfigModal] = useState(false);

  const { data: torneo, isLoading, error } = useQuery({
    queryKey: ['torneo', id],
    queryFn: () => torneoService.getTorneoById(id!),
  });

  const { data: teams } = useQuery({
    queryKey: ['teams', id],
    queryFn: () => teamService.getTeamsByTorneo(id!),
  });

  const { data: tournamentStructure } = useQuery({
    queryKey: ['tournament-structure', id],
    queryFn: () => bracketService.getTournamentStructure(id!),
  });

  const deleteTorneoMutation = useMutation({
    mutationFn: () => torneoService.deleteTorneo(id!),
    onSuccess: () => {
      toast.success('Torneo eliminado exitosamente');
      navigate('/torneos');
    },
    onError: (error) => {
      toast.error('Error al eliminar torneo');
      console.error('Error deleting tournament:', error);
    },
  });

  const changeStatusMutation = useMutation({
    mutationFn: (status: string) => torneoService.changeStatus(id!, status),
    onSuccess: () => {
      toast.success('Estado del torneo actualizado');
      queryClient.invalidateQueries({ queryKey: ['torneo', id] });
      queryClient.invalidateQueries({ queryKey: ['torneos'] });
    },
    onError: (error) => {
      toast.error('Error al cambiar estado');
      console.error('Error changing status:', error);
    },
  });

  const handleDelete = () => {
    if (confirm('¿Estás seguro de que quieres eliminar este torneo?')) {
      deleteTorneoMutation.mutate();
    }
  };

  const handleStatusChange = (newStatus: string) => {
    changeStatusMutation.mutate(newStatus);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DRAFT': return 'bg-gray-100 text-gray-800';
      case 'REGISTRATION': return 'bg-blue-100 text-blue-800';
      case 'IN_PROGRESS': return 'bg-yellow-100 text-yellow-800';
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'DRAFT': return 'Borrador';
      case 'REGISTRATION': return 'Inscripciones';
      case 'IN_PROGRESS': return 'En Progreso';
      case 'COMPLETED': return 'Completado';
      case 'CANCELLED': return 'Cancelado';
      default: return status;
    }
  };

  const getFormatText = (format: string) => {
    switch (format) {
      case 'SINGLE_ELIMINATION': return 'Eliminación Simple';
      case 'DOUBLE_ELIMINATION': return 'Eliminación Doble';
      case 'ROUND_ROBIN': return 'Round Robin';
      case 'SWISS_SYSTEM': return 'Sistema Suizo';
      default: return format;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !torneo) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Torneo no encontrado</h2>
        <button
          onClick={() => navigate('/torneos')}
          className="text-indigo-600 hover:text-indigo-500"
        >
          Volver a la lista de torneos
        </button>
      </div>
    );
  }

  const totalTeams = teams?.length || 0;
  const canGenerateBrackets = totalTeams >= 4 && torneo.status === 'REGISTRATION';

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{torneo.name}</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => navigate('/torneos')}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Volver
          </button>
          <button
            onClick={handleDelete}
            disabled={deleteTorneoMutation.isPending}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 disabled:opacity-50"
          >
            {deleteTorneoMutation.isPending ? 'Eliminando...' : 'Eliminar'}
          </button>
        </div>
      </div>

      {/* Información del torneo */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Estado</h3>
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(torneo.status)}`}>
              {getStatusText(torneo.status)}
            </span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Formato</h3>
            <p className="text-gray-600">{getFormatText(torneo.format)}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Parejas</h3>
            <p className="text-gray-600">{totalTeams} / {torneo.maxTeams}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Fechas</h3>
            <p className="text-gray-600 text-sm">
              {new Date(torneo.startDate).toLocaleDateString()} - {new Date(torneo.endDate).toLocaleDateString()}
            </p>
          </div>
        </div>

        {torneo.description && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Descripción</h3>
            <p className="text-gray-600">{torneo.description}</p>
          </div>
        )}
      </div>

      {/* Acciones del torneo */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Acciones</h2>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => setShowAddTeamModal(true)}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
          >
            Agregar Pareja
          </button>
          
          {canGenerateBrackets && (
            <button
              onClick={() => setShowGroupConfigModal(true)}
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700"
            >
              Configurar Grupos y Brackets
            </button>
          )}

          {torneo.status === 'DRAFT' && (
            <button
              onClick={() => handleStatusChange('REGISTRATION')}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
            >
              Abrir Inscripciones
            </button>
          )}

          {torneo.status === 'REGISTRATION' && totalTeams >= 4 && (
            <button
              onClick={() => handleStatusChange('IN_PROGRESS')}
              className="px-4 py-2 text-sm font-medium text-white bg-yellow-600 border border-transparent rounded-md hover:bg-yellow-700"
            >
              Iniciar Torneo
            </button>
          )}
        </div>
      </div>

      {/* Lista de parejas */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Parejas ({totalTeams})</h2>
        {teams && teams.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teams.map((team) => (
              <div key={team.id} className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">{team.name}</h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <p><strong>Jugador 1:</strong> {team.player1.firstName} {team.player1.lastName}</p>
                  <p><strong>Jugador 2:</strong> {team.player2.firstName} {team.player2.lastName}</p>
                  {team.groupId && (
                    <p className="text-indigo-600 font-medium">
                      Grupo: {team.groupId.split('-').pop()}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No hay parejas registradas aún.</p>
        )}
      </div>

      {/* Estructura del torneo */}
      {tournamentStructure && (tournamentStructure.hasGroups || tournamentStructure.hasBrackets) && (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Estructura del Torneo</h2>
          
          {/* Grupos */}
          {tournamentStructure.hasGroups && (
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Grupos</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {tournamentStructure.groups.map((group) => (
                  <div key={group.id} className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">{group.name}</h4>
                    <div className="space-y-1 text-sm">
                      {group.teams.map((team, index) => (
                        <p key={team.id} className="text-gray-600">
                          {index + 1}. {team.name}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Brackets */}
          {tournamentStructure.hasBrackets && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Eliminación</h3>
              <div className="space-y-4">
                {tournamentStructure.brackets.map((bracket) => (
                  <div key={bracket.id} className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">{bracket.name}</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      {bracket.matches.length} partidos programados
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modales */}
      <AddTeamModal
        isOpen={showAddTeamModal}
        onClose={() => setShowAddTeamModal(false)}
        torneoId={id!}
      />

      <GroupConfigModal
        isOpen={showGroupConfigModal}
        onClose={() => setShowGroupConfigModal(false)}
        torneoId={id!}
        totalTeams={totalTeams}
      />
    </div>
  );
};

export default TorneoDetailPage; 