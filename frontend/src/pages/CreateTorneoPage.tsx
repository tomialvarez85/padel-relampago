import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { torneoService } from '@/services/torneoService';
import { CreateTorneoRequest } from '@/types';
import toast from 'react-hot-toast';

const CreateTorneoPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<CreateTorneoRequest>({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    maxTeams: 8,
    format: 'SINGLE_ELIMINATION',
  });

  const createTorneoMutation = useMutation({
    mutationFn: torneoService.createTorneo,
    onSuccess: () => {
      toast.success('Torneo creado exitosamente');
      queryClient.invalidateQueries({ queryKey: ['torneos'] });
      navigate('/torneos');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Error al crear el torneo');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createTorneoMutation.mutate(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'maxTeams' ? parseInt(value) : value,
    }));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Crear Nuevo Torneo</h1>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre del Torneo *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Ej: Torneo de Verano 2024"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Descripción del torneo..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de Inicio *
              </label>
              <input
                type="datetime-local"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de Fin *
              </label>
              <input
                type="datetime-local"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="maxTeams" className="block text-sm font-medium text-gray-700 mb-1">
                Máximo de Equipos *
              </label>
              <input
                type="number"
                id="maxTeams"
                name="maxTeams"
                value={formData.maxTeams}
                onChange={handleChange}
                min="2"
                max="64"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="format" className="block text-sm font-medium text-gray-700 mb-1">
                Formato *
              </label>
              <select
                id="format"
                name="format"
                value={formData.format}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="SINGLE_ELIMINATION">Eliminación Simple</option>
                <option value="DOUBLE_ELIMINATION">Eliminación Doble</option>
                <option value="ROUND_ROBIN">Liga</option>
                <option value="SWISS_SYSTEM">Sistema Suizo</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/torneos')}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={createTorneoMutation.isPending}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {createTorneoMutation.isPending ? 'Creando...' : 'Crear Torneo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTorneoPage; 