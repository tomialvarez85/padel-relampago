// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// User types (simplified for tournament management)
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: 'ADMIN' | 'PLAYER' | 'REFEREE';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Tournament types
export interface Torneo {
  id: string;
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  maxTeams: number;
  status: 'DRAFT' | 'REGISTRATION' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  format: 'SINGLE_ELIMINATION' | 'DOUBLE_ELIMINATION' | 'ROUND_ROBIN' | 'SWISS_SYSTEM';
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  creator?: User;
  _count?: {
    teams: number;
    matches: number;
  };
}

export interface TorneoWithDetails extends Torneo {
  creator: User;
  teams: TeamWithDetails[];
  matches: MatchWithDetails[];
  brackets: Bracket[];
  _count: {
    teams: number;
    matches: number;
  };
}

export interface CreateTorneoRequest {
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  maxTeams: number;
  format?: 'SINGLE_ELIMINATION' | 'DOUBLE_ELIMINATION' | 'ROUND_ROBIN' | 'SWISS_SYSTEM';
}

export interface UpdateTorneoRequest {
  name?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  maxTeams?: number;
  status?: 'DRAFT' | 'REGISTRATION' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  format?: 'SINGLE_ELIMINATION' | 'DOUBLE_ELIMINATION' | 'ROUND_ROBIN' | 'SWISS_SYSTEM';
}

// Team types
export interface Team {
  id: string;
  name: string;
  torneoId: string;
  createdAt: string;
  updatedAt: string;
}

export interface PlayerTeam {
  id: string;
  playerId: string;
  teamId: string;
  isCaptain: boolean;
  createdAt: string;
  player?: User;
  team?: Team;
}

export interface TeamWithDetails extends Team {
  torneo: Torneo;
  playerTeams: (PlayerTeam & {
    player: User;
  })[];
  homeMatches: Match[];
  awayMatches: Match[];
}

export interface CreateTeamRequest {
  name: string;
  playerIds: string[];
  captainId?: string;
}

export interface UpdateTeamRequest {
  name?: string;
  playerIds?: string[];
  captainId?: string;
}

// Match types
export interface Match {
  id: string;
  torneoId: string;
  homeTeamId: string;
  awayTeamId: string;
  homeScore: number;
  awayScore: number;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'WALKOVER';
  scheduledAt?: string;
  startedAt?: string;
  endedAt?: string;
  refereeId?: string;
  bracketId?: string;
  round: number;
  matchNumber: number;
  createdAt: string;
  updatedAt: string;
}

export interface MatchWithDetails extends Match {
  torneo: Torneo;
  homeTeam: TeamWithDetails;
  awayTeam: TeamWithDetails;
  referee?: User;
  bracket?: Bracket;
}

export interface CreateMatchRequest {
  homeTeamId: string;
  awayTeamId: string;
  scheduledAt?: string;
  refereeId?: string;
  round: number;
  matchNumber: number;
  bracketId?: string;
}

export interface UpdateMatchRequest {
  homeScore?: number;
  awayScore?: number;
  status?: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'WALKOVER';
  scheduledAt?: string;
  startedAt?: string;
  endedAt?: string;
  refereeId?: string;
}

// Bracket types
export interface Bracket {
  id: string;
  torneoId: string;
  name: string;
  type: 'MAIN' | 'CONSOLATION' | 'FINAL';
  createdAt: string;
  updatedAt: string;
}

export interface CreateBracketRequest {
  name: string;
  type?: 'MAIN' | 'CONSOLATION' | 'FINAL';
}

// Statistics types
export interface TorneoStats {
  totalTeams: number;
  totalPlayers: number;
  completedMatches: number;
  totalMatches: number;
  completionPercentage: number;
}

export interface PlayerStats {
  playerId: string;
  player: User;
  matchesPlayed: number;
  matchesWon: number;
  matchesLost: number;
  winPercentage: number;
  totalGamesWon: number;
  totalGamesLost: number;
}

export interface TeamStats {
  teamId: string;
  team: Team;
  matchesPlayed: number;
  matchesWon: number;
  matchesLost: number;
  winPercentage: number;
  totalGamesWon: number;
  totalGamesLost: number;
}

// UI Component types
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea' | 'date' | 'datetime-local';
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  validation?: {
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
    pattern?: string;
  };
}

export interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

export interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
  headerActions?: React.ReactNode;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showCloseButton?: boolean;
}

export interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  loading?: boolean;
  emptyMessage?: string;
  onRowClick?: (item: T) => void;
  className?: string;
}

export interface TableColumn<T> {
  key: string;
  header: string;
  render?: (value: any, item: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}

// Navigation types
export interface NavItem {
  label: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  children?: NavItem[];
  badge?: string | number;
}

// Filter types
export interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

export interface FilterConfig {
  key: string;
  label: string;
  type: 'select' | 'search' | 'date' | 'checkbox';
  options?: FilterOption[];
  placeholder?: string;
}

// Theme types
export type Theme = 'light' | 'dark' | 'system';

// App state types
export interface AppState {
  theme: Theme;
  sidebarOpen: boolean;
  notifications: Notification[];
}

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  createdAt: Date;
}

// Status types
export type StatusColor = 'success' | 'warning' | 'error' | 'info' | 'default';

export interface StatusConfig {
  label: string;
  color: StatusColor;
  icon?: React.ComponentType<{ className?: string }>;
} 