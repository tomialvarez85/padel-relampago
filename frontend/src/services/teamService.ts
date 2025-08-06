import { teamService as storageTeamService } from './storageService';
import { CreateTeamRequest, UpdateTeamRequest } from '@/types';

// Wrapper to simulate API-like interface
const simulateApiCall = <T>(data: T): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), 100); // Simulate network delay
  });
};

export const teamService = {
  // Get all teams
  getTeams: async () => {
    const teams = storageTeamService.getTeams();
    return simulateApiCall(teams);
  },

  // Get teams by tournament
  getTeamsByTorneo: async (torneoId: string) => {
    const teams = storageTeamService.getTeamsByTorneo(torneoId);
    return simulateApiCall(teams);
  },

  // Get team by ID
  getTeamById: async (id: string) => {
    const team = storageTeamService.getTeamById(id);
    if (!team) {
      throw new Error('Equipo no encontrado');
    }
    return simulateApiCall(team);
  },

  // Create team
  createTeam: async (data: CreateTeamRequest) => {
    const team = storageTeamService.createTeam(data);
    return simulateApiCall(team);
  },

  // Update team
  updateTeam: async (id: string, data: UpdateTeamRequest) => {
    const team = storageTeamService.updateTeam(id, data);
    if (!team) {
      throw new Error('Equipo no encontrado');
    }
    return simulateApiCall(team);
  },

  // Delete team
  deleteTeam: async (id: string) => {
    const success = storageTeamService.deleteTeam(id);
    if (!success) {
      throw new Error('Equipo no encontrado');
    }
    return simulateApiCall({ message: 'Equipo eliminado exitosamente' });
  },

  // Get teams count by tournament
  getTeamsCountByTorneo: async (torneoId: string) => {
    const teams = storageTeamService.getTeamsByTorneo(torneoId);
    return simulateApiCall({ count: teams.length });
  },
};

export default teamService; 