import { bracketService as storageBracketService, groupService as storageGroupService } from './storageService';
import { TournamentConfig } from '@/types';

// Wrapper to simulate API-like interface
const simulateApiCall = <T>(data: T): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), 100); // Simulate network delay
  });
};

export const bracketService = {
  // Get all brackets
  getBrackets: async () => {
    const brackets = storageBracketService.getBrackets();
    return simulateApiCall(brackets);
  },

  // Get brackets by tournament
  getBracketsByTorneo: async (torneoId: string) => {
    const brackets = storageBracketService.getBracketsByTorneo(torneoId);
    return simulateApiCall(brackets);
  },

  // Get groups by tournament
  getGroupsByTorneo: async (torneoId: string) => {
    const groups = storageGroupService.getGroupsByTorneo(torneoId);
    return simulateApiCall(groups);
  },

  // Generate brackets for tournament
  generateBrackets: async (torneoId: string, config: TournamentConfig) => {
    const result = storageBracketService.generateBrackets(torneoId, config);
    return simulateApiCall(result);
  },

  // Create groups for tournament
  createGroups: async (torneoId: string, config: TournamentConfig) => {
    const groups = storageGroupService.createGroups(torneoId, config);
    return simulateApiCall(groups);
  },

  // Get tournament structure
  getTournamentStructure: async (torneoId: string) => {
    const groups = storageGroupService.getGroupsByTorneo(torneoId);
    const brackets = storageBracketService.getBracketsByTorneo(torneoId);
    
    return simulateApiCall({
      groups,
      brackets,
      hasGroups: groups.length > 0,
      hasBrackets: brackets.length > 0,
    });
  },
};

export default bracketService; 