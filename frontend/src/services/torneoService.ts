import { tournamentService as storageTournamentService } from './storageService';
import { CreateTorneoRequest, UpdateTorneoRequest, TorneoStats } from '@/types';

// Wrapper to simulate API-like interface
const simulateApiCall = <T>(data: T): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), 100); // Simulate network delay
  });
};

export const torneoService = {
  // Get all tournaments
  getTorneos: async (page = 1, limit = 10, search?: string, status?: string) => {
    let torneos = storageTournamentService.getTorneos();
    
    // Apply search filter
    if (search) {
      torneos = storageTournamentService.searchTorneos(search, status);
    } else if (status) {
      torneos = torneos.filter(t => t.status === status);
    }
    
    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedTorneos = torneos.slice(startIndex, endIndex);
    
    const result = {
      torneos: paginatedTorneos,
      pagination: {
        page,
        limit,
        total: torneos.length,
        totalPages: Math.ceil(torneos.length / limit),
      },
    };
    
    return simulateApiCall(result);
  },

  // Get active tournaments
  getActiveTorneos: async () => {
    const torneos = storageTournamentService.getActiveTorneos();
    return simulateApiCall(torneos);
  },

  // Get tournament by ID
  getTorneoById: async (id: string) => {
    const torneo = storageTournamentService.getTorneoById(id);
    if (!torneo) {
      throw new Error('Torneo no encontrado');
    }
    return simulateApiCall(torneo);
  },

  // Create new tournament
  createTorneo: async (data: CreateTorneoRequest) => {
    const torneo = storageTournamentService.createTorneo(data);
    return simulateApiCall(torneo);
  },

  // Update tournament
  updateTorneo: async (id: string, data: UpdateTorneoRequest) => {
    const torneo = storageTournamentService.updateTorneo(id, data);
    if (!torneo) {
      throw new Error('Torneo no encontrado');
    }
    return simulateApiCall(torneo);
  },

  // Delete tournament
  deleteTorneo: async (id: string) => {
    const success = storageTournamentService.deleteTorneo(id);
    if (!success) {
      throw new Error('Torneo no encontrado');
    }
    return simulateApiCall({ message: 'Torneo eliminado exitosamente' });
  },

  // Change tournament status
  changeStatus: async (id: string, status: string) => {
    const torneo = storageTournamentService.changeStatus(id, status);
    if (!torneo) {
      throw new Error('Torneo no encontrado');
    }
    return simulateApiCall(torneo);
  },

  // Get tournament statistics
  getTorneoStats: async (id: string) => {
    const torneo = storageTournamentService.getTorneoById(id);
    if (!torneo) {
      throw new Error('Torneo no encontrado');
    }
    
    // For now, return basic stats
    const stats: TorneoStats = {
      totalTeams: torneo._count?.teams || 0,
      totalPlayers: 0, // Would need to calculate from teams
      completedMatches: 0, // Would need to calculate from matches
      totalMatches: torneo._count?.matches || 0,
      completionPercentage: 0,
    };
    
    return simulateApiCall(stats);
  },

  // Check if tournament is full
  isTorneoFull: async (id: string) => {
    const torneo = storageTournamentService.getTorneoById(id);
    if (!torneo) {
      throw new Error('Torneo no encontrado');
    }
    
    const isFull = (torneo._count?.teams || 0) >= torneo.maxTeams;
    return simulateApiCall({ isFull });
  },
};

export default torneoService; 