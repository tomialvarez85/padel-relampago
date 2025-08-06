import { Torneo, CreateTorneoRequest, UpdateTorneoRequest, User, Team, Group, Match, Bracket, CreateTeamRequest, UpdateTeamRequest, TournamentConfig, BracketGenerationResult } from '@/types';

// Storage keys
const STORAGE_KEYS = {
  TORNEOS: 'padel-tournaments',
  USERS: 'padel-users',
  TEAMS: 'padel-teams',
  GROUPS: 'padel-groups',
  MATCHES: 'padel-matches',
  BRACKETS: 'padel-brackets',
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

// Team service
export const teamService = {
  // Get all teams
  getTeams: (): Team[] => {
    return getFromStorage<Team[]>(STORAGE_KEYS.TEAMS, []);
  },

  // Get teams by tournament
  getTeamsByTorneo: (torneoId: string): Team[] => {
    const teams = teamService.getTeams();
    return teams.filter(t => t.torneoId === torneoId);
  },

  // Get team by ID
  getTeamById: (id: string): Team | null => {
    const teams = teamService.getTeams();
    return teams.find(t => t.id === id) || null;
  },

  // Create team
  createTeam: (data: CreateTeamRequest): Team => {
    const teams = teamService.getTeams();
    const newTeam: Team = {
      id: `team-${Date.now()}`,
      name: data.name,
      player1: data.player1,
      player2: data.player2,
      torneoId: data.torneoId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    teams.push(newTeam);
    saveToStorage(STORAGE_KEYS.TEAMS, teams);
    
    // Update tournament team count
    const torneos = tournamentService.getTorneos();
    const torneoIndex = torneos.findIndex(t => t.id === data.torneoId);
    if (torneoIndex !== -1) {
      const currentCount = torneos[torneoIndex]._count || { teams: 0, matches: 0 };
      torneos[torneoIndex]._count = {
        teams: currentCount.teams + 1,
        matches: currentCount.matches,
      };
      saveToStorage(STORAGE_KEYS.TORNEOS, torneos);
    }
    
    return newTeam;
  },

  // Update team
  updateTeam: (id: string, data: UpdateTeamRequest): Team | null => {
    const teams = teamService.getTeams();
    const index = teams.findIndex(t => t.id === id);
    
    if (index === -1) return null;
    
    teams[index] = {
      ...teams[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    
    saveToStorage(STORAGE_KEYS.TEAMS, teams);
    return teams[index];
  },

  // Delete team
  deleteTeam: (id: string): boolean => {
    const teams = teamService.getTeams();
    const team = teams.find(t => t.id === id);
    if (!team) return false;
    
    const filteredTeams = teams.filter(t => t.id !== id);
    saveToStorage(STORAGE_KEYS.TEAMS, filteredTeams);
    
    // Update tournament team count
    const torneos = tournamentService.getTorneos();
    const torneoIndex = torneos.findIndex(t => t.id === team.torneoId);
    if (torneoIndex !== -1) {
      const currentCount = torneos[torneoIndex]._count || { teams: 0, matches: 0 };
      torneos[torneoIndex]._count = {
        teams: Math.max(0, currentCount.teams - 1),
        matches: currentCount.matches,
      };
      saveToStorage(STORAGE_KEYS.TORNEOS, torneos);
    }
    
    return true;
  },
};

// Group service
export const groupService = {
  // Get all groups
  getGroups: (): Group[] => {
    return getFromStorage<Group[]>(STORAGE_KEYS.GROUPS, []);
  },

  // Get groups by tournament
  getGroupsByTorneo: (torneoId: string): Group[] => {
    const groups = groupService.getGroups();
    return groups.filter(g => g.torneoId === torneoId);
  },

  // Create groups for tournament
  createGroups: (torneoId: string, config: TournamentConfig): Group[] => {
    const teams = teamService.getTeamsByTorneo(torneoId);
    const groups: Group[] = [];
    
    // Shuffle teams for random distribution
    const shuffledTeams = [...teams].sort(() => Math.random() - 0.5);
    
    for (let i = 0; i < config.numberOfGroups; i++) {
      const groupTeams = shuffledTeams.slice(i * config.teamsPerGroup, (i + 1) * config.teamsPerGroup);
      
      const group: Group = {
        id: `group-${torneoId}-${i + 1}`,
        name: `Grupo ${String.fromCharCode(65 + i)}`, // A, B, C, etc.
        torneoId,
        teams: groupTeams,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      groups.push(group);
      
      // Update teams with group info
      groupTeams.forEach((team, index) => {
        if (team && team.id) {
          teamService.updateTeam(team.id, {
            groupId: group.id,
            groupPosition: index + 1,
          });
        }
      });
    }
    
    const allGroups = groupService.getGroups();
    allGroups.push(...groups);
    saveToStorage(STORAGE_KEYS.GROUPS, allGroups);
    
    return groups;
  },
};

// Match service
export const matchService = {
  // Get all matches
  getMatches: (): Match[] => {
    return getFromStorage<Match[]>(STORAGE_KEYS.MATCHES, []);
  },

  // Get matches by tournament
  getMatchesByTorneo: (torneoId: string): Match[] => {
    const matches = matchService.getMatches();
    return matches.filter(m => m.torneoId === torneoId);
  },

  // Create match
  createMatch: (data: Partial<Match>): Match => {
    const matches = matchService.getMatches();
    const newMatch: Match = {
      id: `match-${Date.now()}`,
      torneoId: data.torneoId!,
      homeTeamId: data.homeTeamId!,
      awayTeamId: data.awayTeamId!,
      homeScore: data.homeScore || 0,
      awayScore: data.awayScore || 0,
      status: data.status || 'SCHEDULED',
      scheduledAt: data.scheduledAt,
      round: data.round || 1,
      matchNumber: data.matchNumber || 1,
      groupId: data.groupId,
      bracketId: data.bracketId,
      winnerId: data.winnerId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    matches.push(newMatch);
    saveToStorage(STORAGE_KEYS.MATCHES, matches);
    
    // Update tournament match count
    const torneos = tournamentService.getTorneos();
    const torneoIndex = torneos.findIndex(t => t.id === data.torneoId);
    if (torneoIndex !== -1) {
      const currentCount = torneos[torneoIndex]._count || { teams: 0, matches: 0 };
      torneos[torneoIndex]._count = {
        teams: currentCount.teams,
        matches: currentCount.matches + 1,
      };
      saveToStorage(STORAGE_KEYS.TORNEOS, torneos);
    }
    
    return newMatch;
  },

  // Update match
  updateMatch: (id: string, data: Partial<Match>): Match | null => {
    const matches = matchService.getMatches();
    const index = matches.findIndex(m => m.id === id);
    
    if (index === -1) return null;
    
    matches[index] = {
      ...matches[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    
    saveToStorage(STORAGE_KEYS.MATCHES, matches);
    return matches[index];
  },
};

// Bracket service
export const bracketService = {
  // Get all brackets
  getBrackets: (): Bracket[] => {
    return getFromStorage<Bracket[]>(STORAGE_KEYS.BRACKETS, []);
  },

  // Get brackets by tournament
  getBracketsByTorneo: (torneoId: string): Bracket[] => {
    const brackets = bracketService.getBrackets();
    return brackets.filter(b => b.torneoId === torneoId);
  },

  // Generate brackets for tournament
  generateBrackets: (torneoId: string, config: TournamentConfig): BracketGenerationResult => {
    const groups = groupService.getGroupsByTorneo(torneoId);
    const brackets: Bracket[] = [];
    const matches: Match[] = [];
    
    // Create group matches (Round 1)
    groups.forEach(group => {
      const groupMatches = bracketService.createGroupMatches(group);
      matches.push(...groupMatches);
    });
    
    // Create elimination brackets
    const advancingTeams = bracketService.getAdvancingTeams(groups, config.teamsAdvancingPerGroup);
    
    // Quarter Finals (Round 2)
    if (advancingTeams.length >= 8) {
      const quarterFinals = bracketService.createEliminationBracket(
        torneoId,
        'Cuartos de Final',
        2,
        advancingTeams.slice(0, 8)
      );
      brackets.push(quarterFinals.bracket);
      matches.push(...quarterFinals.matches);
    }
    
    // Semi Finals (Round 3)
    if (advancingTeams.length >= 4) {
      const semiFinals = bracketService.createEliminationBracket(
        torneoId,
        'Semifinales',
        3,
        advancingTeams.slice(0, 4)
      );
      brackets.push(semiFinals.bracket);
      matches.push(...semiFinals.matches);
    }
    
    // Final (Round 4)
    if (advancingTeams.length >= 2) {
      const final = bracketService.createEliminationBracket(
        torneoId,
        'Final',
        4,
        advancingTeams.slice(0, 2)
      );
      brackets.push(final.bracket);
      matches.push(...final.matches);
    }
    
    // Save brackets and matches
    const allBrackets = bracketService.getBrackets();
    allBrackets.push(...brackets);
    saveToStorage(STORAGE_KEYS.BRACKETS, allBrackets);
    
    const allMatches = matchService.getMatches();
    allMatches.push(...matches);
    saveToStorage(STORAGE_KEYS.MATCHES, allMatches);
    
    return { groups, brackets, matches };
  },

  // Create group matches
  createGroupMatches: (group: Group): Match[] => {
    const matches: Match[] = [];
    const teams = group.teams;
    
    // Create round-robin matches within group
    for (let i = 0; i < teams.length; i++) {
      for (let j = i + 1; j < teams.length; j++) {
        const team1 = teams[i];
        const team2 = teams[j];
        if (team1 && team2 && team1.id && team2.id) {
          const match = matchService.createMatch({
            torneoId: group.torneoId,
            homeTeamId: team1.id,
            awayTeamId: team2.id,
            round: 1,
            matchNumber: matches.length + 1,
            groupId: group.id,
          });
          matches.push(match);
        }
      }
    }
    
    return matches;
  },

  // Get advancing teams from groups
  getAdvancingTeams: (groups: Group[], teamsAdvancing: number): Team[] => {
    const advancingTeams: Team[] = [];
    
    groups.forEach(group => {
      // For now, just take the first N teams from each group
      // In a real implementation, you'd calculate based on match results
      const groupTeams = group.teams.slice(0, teamsAdvancing);
      advancingTeams.push(...groupTeams);
    });
    
    return advancingTeams;
  },

  // Create elimination bracket
  createEliminationBracket: (torneoId: string, name: string, round: number, teams: Team[]): { bracket: Bracket; matches: Match[] } => {
    const bracket: Bracket = {
      id: `bracket-${torneoId}-${round}`,
      name,
      torneoId,
      round,
      matches: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    const matches: Match[] = [];
    
    // Create matches for the bracket
    for (let i = 0; i < teams.length; i += 2) {
      const team1 = teams[i];
      const team2 = teams[i + 1];
      if (team1 && team2 && team1.id && team2.id) {
        const match = matchService.createMatch({
          torneoId,
          homeTeamId: team1.id,
          awayTeamId: team2.id,
          round,
          matchNumber: matches.length + 1,
          bracketId: bracket.id,
        });
        matches.push(match);
        bracket.matches.push(match);
      }
    }
    
    return { bracket, matches };
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
  teamService,
  groupService,
  matchService,
  bracketService,
  userService,
  initializeSampleData,
}; 