import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { teamService } from '@/services/teamService';
import { CreateTeamRequest } from '@/types';
import toast from 'react-hot-toast';

interface AddTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  torneoId: string;
}

const AddTeamModal = ({ isOpen, onClose, torneoId }: AddTeamModalProps) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<CreateTeamRequest>({
    name: '',
    player1: { firstName: '', lastName: '' },
    player2: { firstName: '', lastName: '' },
    torneoId,
  });

  const createTeamMutation = useMutation({
    mutationFn: (data: CreateTeamRequest) => teamService.createTeam(data),
    onSuccess: () => {
      toast.success('Pareja agregada exitosamente');
      queryClient.invalidateQueries({ queryKey: ['teams', torneoId] });
      queryClient.invalidateQueries({ queryKey: ['torneos'] });
      onClose();
      setFormData({
        name: '',
        player1: { firstName: '', lastName: '' },
        player2: { firstName: '', lastName: '' },
        torneoId,
      });
    },
    onError: (error) => {
      toast.error('Error al agregar pareja');
      console.error('Error creating team:', error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createTeamMutation.mutate(formData);
  };

  const handleChange = (field: string, value: string, player?: 'player1' | 'player2') => {
    if (player) {
      setFormData(prev => ({
        ...prev,
        [player]: {
          ...prev[player],
          [field]: value,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Agregar Pareja</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nombre del equipo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre del Equipo *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Ej: Los Relámpagos"
            />
          </div>

          {/* Jugador 1 */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Jugador 1</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre *
                </label>
                <input
                  type="text"
                  required
                  value={formData.player1.firstName}
                  onChange={(e) => handleChange('firstName', e.target.value, 'player1')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Nombre"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Apellido *
                </label>
                <input
                  type="text"
                  required
                  value={formData.player1.lastName}
                  onChange={(e) => handleChange('lastName', e.target.value, 'player1')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Apellido"
                />
              </div>
            </div>
          </div>

          {/* Jugador 2 */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Jugador 2</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre *
                </label>
                <input
                  type="text"
                  required
                  value={formData.player2.firstName}
                  onChange={(e) => handleChange('firstName', e.target.value, 'player2')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Nombre"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Apellido *
                </label>
                <input
                  type="text"
                  required
                  value={formData.player2.lastName}
                  onChange={(e) => handleChange('lastName', e.target.value, 'player2')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Apellido"
                />
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={createTeamMutation.isPending}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {createTeamMutation.isPending ? 'Agregando...' : 'Agregar Pareja'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTeamModal; 