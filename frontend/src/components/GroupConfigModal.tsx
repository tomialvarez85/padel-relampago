import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { bracketService } from '@/services/bracketService';
import { TournamentConfig } from '@/types';
import toast from 'react-hot-toast';

interface GroupConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  torneoId: string;
  totalTeams: number;
}

const GroupConfigModal = ({ isOpen, onClose, torneoId, totalTeams }: GroupConfigModalProps) => {
  const queryClient = useQueryClient();
  const [config, setConfig] = useState<TournamentConfig>({
    numberOfGroups: 4,
    teamsPerGroup: Math.ceil(totalTeams / 4),
    teamsAdvancingPerGroup: 2,
  });

  const generateBracketsMutation = useMutation({
    mutationFn: () => bracketService.generateBrackets(torneoId, config),
    onSuccess: () => {
      toast.success('Grupos y brackets generados exitosamente');
      queryClient.invalidateQueries({ queryKey: ['tournament-structure', torneoId] });
      queryClient.invalidateQueries({ queryKey: ['torneos'] });
      onClose();
    },
    onError: (error) => {
      toast.error('Error al generar grupos y brackets');
      console.error('Error generating brackets:', error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    generateBracketsMutation.mutate();
  };

  const handleConfigChange = (field: keyof TournamentConfig, value: number) => {
    setConfig(prev => {
      const newConfig = { ...prev, [field]: value };
      
      // Auto-calculate other values
      if (field === 'numberOfGroups') {
        newConfig.teamsPerGroup = Math.ceil(totalTeams / value);
        newConfig.teamsAdvancingPerGroup = Math.max(1, Math.floor(newConfig.teamsPerGroup / 2));
      } else if (field === 'teamsPerGroup') {
        newConfig.numberOfGroups = Math.ceil(totalTeams / value);
        newConfig.teamsAdvancingPerGroup = Math.max(1, Math.floor(value / 2));
      }
      
      return newConfig;
    });
  };

  const totalAdvancingTeams = config.numberOfGroups * config.teamsAdvancingPerGroup;
  const isValid = totalTeams >= config.numberOfGroups * config.teamsPerGroup;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Configurar Grupos</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-medium text-blue-900 mb-2">Resumen del Torneo</h3>
          <p className="text-blue-700 text-sm">
            Total de parejas: <span className="font-semibold">{totalTeams}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Número de grupos */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Número de Grupos
            </label>
            <select
              value={config.numberOfGroups}
              onChange={(e) => handleConfigChange('numberOfGroups', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {[2, 3, 4, 5, 6, 8].map(num => (
                <option key={num} value={num}>
                  {num} grupos
                </option>
              ))}
            </select>
          </div>

          {/* Equipos por grupo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Equipos por Grupo
            </label>
            <input
              type="number"
              min="2"
              max="8"
              value={config.teamsPerGroup}
              onChange={(e) => handleConfigChange('teamsPerGroup', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <p className="text-sm text-gray-500 mt-1">
              Máximo {Math.floor(totalTeams / config.numberOfGroups)} equipos por grupo
            </p>
          </div>

          {/* Equipos que avanzan por grupo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Equipos que Avanzan por Grupo
            </label>
            <input
              type="number"
              min="1"
              max={config.teamsPerGroup}
              value={config.teamsAdvancingPerGroup}
              onChange={(e) => handleConfigChange('teamsAdvancingPerGroup', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <p className="text-sm text-gray-500 mt-1">
              Máximo {config.teamsPerGroup} equipos por grupo
            </p>
          </div>

          {/* Resumen de la configuración */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">Resumen de la Configuración</h3>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Grupos:</span> {config.numberOfGroups}</p>
              <p><span className="font-medium">Equipos por grupo:</span> {config.teamsPerGroup}</p>
              <p><span className="font-medium">Equipos que avanzan por grupo:</span> {config.teamsAdvancingPerGroup}</p>
              <p><span className="font-medium">Total de equipos que avanzan:</span> {totalAdvancingTeams}</p>
              <p><span className="font-medium">Estructura de eliminación:</span></p>
              <ul className="ml-4 text-gray-600">
                {totalAdvancingTeams >= 8 && <li>• Cuartos de Final (8 equipos)</li>}
                {totalAdvancingTeams >= 4 && <li>• Semifinales (4 equipos)</li>}
                {totalAdvancingTeams >= 2 && <li>• Final (2 equipos)</li>}
              </ul>
            </div>
          </div>

          {/* Validación */}
          {!isValid && (
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-red-700 text-sm">
                ⚠️ La configuración no es válida. Necesitas al menos {config.numberOfGroups * config.teamsPerGroup} equipos.
              </p>
            </div>
          )}

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
              disabled={generateBracketsMutation.isPending || !isValid}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {generateBracketsMutation.isPending ? 'Generando...' : 'Generar Grupos y Brackets'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GroupConfigModal; 