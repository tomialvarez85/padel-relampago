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

// Team types (parejas)
export interface Team {
  id: string;
  name: string;
  player1: {
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
  };
  player2: {
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
  };
  torneoId: string;
  groupId?: string;
  groupPosition?: number;
  isEliminated?: boolean;
  createdAt: string;
  updatedAt: string;
}

// Group types
export interface Group {
  id: string;
  name: string;
  torneoId: string;
  teams: Team[];
  createdAt: string;
  updatedAt: string;
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
  round: number; // 1: Groups, 2: Quarter Finals, 3: Semi Finals, 4: Final
  matchNumber: number;
  groupId?: string; // For group matches
  bracketId?: string; // For elimination matches
  winnerId?: string;
  createdAt: string;
  updatedAt: string;
}

// Bracket types
export interface Bracket {
  id: string;
  name: string;
  torneoId: string;
  round: number;
  matches: Match[];
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
  _count: {
    teams: number;
    matches: number;
  };
}

// Request types
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

export interface CreateTeamRequest {
  name: string;
  player1: {
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
  };
  player2: {
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
  };
  torneoId: string;
}

export interface UpdateTeamRequest {
  name?: string;
  player1?: {
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
  };
  player2?: {
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
  };
  groupId?: string;
  groupPosition?: number;
}

export interface CreateUserRequest {
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role?: 'ADMIN' | 'PLAYER' | 'REFEREE';
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;
  role?: 'ADMIN' | 'PLAYER' | 'REFEREE';
  isActive?: boolean;
}

// Statistics types
export interface TorneoStats {
  totalTeams: number;
  totalPlayers: number;
  completedMatches: number;
  totalMatches: number;
  completionPercentage: number;
}

// Tournament configuration
export interface TournamentConfig {
  numberOfGroups: number;
  teamsPerGroup: number;
  teamsAdvancingPerGroup: number;
}

// Bracket generation result
export interface BracketGenerationResult {
  groups: Group[];
  brackets: Bracket[];
  matches: Match[];
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