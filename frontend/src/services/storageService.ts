import { Torneo, CreateTorneoRequest, UpdateTorneoRequest, User } from '@/types';

// Storage keys
const STORAGE_KEYS = {
  TORNEOS: 'padel-tournaments',
  USERS: 'padel-users',
  TEAMS: 'padel-teams',
  MATCHES: 'padel-matches',
} as const;

// Helper functions
const getFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading from localStorage (${key}):`, error);
    return defaultValue;
  }
};

const saveToStorage = <T>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving to localStorage (${key}):`, error);
  }
};

// Tournament service
export const tournamentService = {
  // Get all tournaments
  getTorneos: (): Torneo[] => {
    return getFromStorage<Torneo[]>(STORAGE_KEYS.TORNEOS, []);
  },

  // Get tournament by ID
  getTorneoById: (id: string): Torneo | null => {
    const torneos = tournamentService.getTorneos();
    return torneos.find(t => t.id === id) || null;
  },

  // Create new tournament
  createTorneo: (data: CreateTorneoRequest): Torneo => {
    const torneos = tournamentService.getTorneos();
    const newTorneo: Torneo = {
      id: `torneo-${Date.now()}`,
      name: data.name,
      description: data.description || '',
      startDate: data.startDate,
      endDate: data.endDate,
      maxTeams: data.maxTeams,
      status: 'DRAFT',
      format: data.format || 'SINGLE_ELIMINATION',
      createdBy: 'system',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      _count: {
        teams: 0,
        matches: 0,
      },
    };
    
    torneos.push(newTorneo);
    saveToStorage(STORAGE_KEYS.TORNEOS, torneos);
    return newTorneo;
  },

  // Update tournament
  updateTorneo: (id: string, data: UpdateTorneoRequest): Torneo | null => {
    const torneos = tournamentService.getTorneos();
    const index = torneos.findIndex(t => t.id === id);
    
    if (index === -1) return null;
    
    torneos[index] = {
      ...torneos[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    
    saveToStorage(STORAGE_KEYS.TORNEOS, torneos);
    return torneos[index];
  },

  // Delete tournament
  deleteTorneo: (id: string): boolean => {
    const torneos = tournamentService.getTorneos();
    const filteredTorneos = torneos.filter(t => t.id !== id);
    
    if (filteredTorneos.length === torneos.length) {
      return false; // Tournament not found
    }
    
    saveToStorage(STORAGE_KEYS.TORNEOS, filteredTorneos);
    return true;
  },

  // Change tournament status
  changeStatus: (id: string, status: string): Torneo | null => {
    return tournamentService.updateTorneo(id, { status: status as any });
  },

  // Get active tournaments
  getActiveTorneos: (): Torneo[] => {
    const torneos = tournamentService.getTorneos();
    return torneos.filter(t => 
      t.status === 'REGISTRATION' || t.status === 'IN_PROGRESS'
    );
  },

  // Search tournaments
  searchTorneos: (query: string, status?: string): Torneo[] => {
    let torneos = tournamentService.getTorneos();
    
    if (query) {
      const searchTerm = query.toLowerCase();
      torneos = torneos.filter(t => 
        t.name.toLowerCase().includes(searchTerm) ||
        (t.description && t.description.toLowerCase().includes(searchTerm))
      );
    }
    
    if (status) {
      torneos = torneos.filter(t => t.status === status);
    }
    
    return torneos;
  },
};

// User service
export const userService = {
  // Get all users
  getUsers: (): User[] => {
    return getFromStorage<User[]>(STORAGE_KEYS.USERS, []);
  },

  // Create user
  createUser: (data: any): User => {
    const users = userService.getUsers();
    const newUser: User = {
      id: `user-${Date.now()}`,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      role: data.role || 'PLAYER',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    users.push(newUser);
    saveToStorage(STORAGE_KEYS.USERS, users);
    return newUser;
  },

  // Get users by role
  getUsersByRole: (role: string): User[] => {
    const users = userService.getUsers();
    return users.filter(u => u.role === role);
  },
};

// Team service
export const teamService = {
  // Get all teams
  getTeams: (): any[] => {
    return getFromStorage<any[]>(STORAGE_KEYS.TEAMS, []);
  },

  // Create team
  createTeam: (data: any): any => {
    const teams = teamService.getTeams();
    const newTeam = {
      id: `team-${Date.now()}`,
      name: data.name,
      torneoId: data.torneoId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    teams.push(newTeam);
    saveToStorage(STORAGE_KEYS.TEAMS, teams);
    return newTeam;
  },

  // Get teams by tournament
  getTeamsByTorneo: (torneoId: string): any[] => {
    const teams = teamService.getTeams();
    return teams.filter(t => t.torneoId === torneoId);
  },
};

// Match service
export const matchService = {
  // Get all matches
  getMatches: (): any[] => {
    return getFromStorage<any[]>(STORAGE_KEYS.MATCHES, []);
  },

  // Create match
  createMatch: (data: any): any => {
    const matches = matchService.getMatches();
    const newMatch = {
      id: `match-${Date.now()}`,
      torneoId: data.torneoId,
      homeTeamId: data.homeTeamId,
      awayTeamId: data.awayTeamId,
      status: 'SCHEDULED',
      homeScore: 0,
      awayScore: 0,
      scheduledAt: data.scheduledAt,
      round: data.round || 1,
      matchNumber: data.matchNumber || 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    matches.push(newMatch);
    saveToStorage(STORAGE_KEYS.MATCHES, matches);
    return newMatch;
  },

  // Get matches by tournament
  getMatchesByTorneo: (torneoId: string): any[] => {
    const matches = matchService.getMatches();
    return matches.filter(m => m.torneoId === torneoId);
  },
};

// Initialize with sample data if empty
export const initializeSampleData = () => {
  const torneos = tournamentService.getTorneos();
  
  if (torneos.length === 0) {
    // Create sample tournaments
    const sampleTorneos: Torneo[] = [
      {
        id: 'torneo-1',
        name: 'Torneo de Verano 2024',
        description: 'Torneo de pádel para todos los niveles',
        startDate: '2024-07-15T10:00:00Z',
        endDate: '2024-07-20T18:00:00Z',
        maxTeams: 16,
        status: 'REGISTRATION',
        format: 'SINGLE_ELIMINATION',
        createdBy: 'system',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        _count: { teams: 0, matches: 0 },
      },
      {
        id: 'torneo-2',
        name: 'Copa Invierno',
        description: 'Torneo de invierno con formato doble eliminación',
        startDate: '2024-08-01T09:00:00Z',
        endDate: '2024-08-05T17:00:00Z',
        maxTeams: 8,
        status: 'DRAFT',
        format: 'DOUBLE_ELIMINATION',
        createdBy: 'system',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        _count: { teams: 0, matches: 0 },
      },
    ];
    
    saveToStorage(STORAGE_KEYS.TORNEOS, sampleTorneos);
    console.log('✅ Datos de ejemplo inicializados');
  }
};

export default {
  tournamentService,
  userService,
  teamService,
  matchService,
  initializeSampleData,
}; 