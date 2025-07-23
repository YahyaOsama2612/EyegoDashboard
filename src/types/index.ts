export interface User {
  email: string;
  password: string;
}

export interface UserState {
  isAuthenticated: boolean;
  userInfo: User | null;
}

export interface SortingState {
  id: string;
  desc: boolean;
}

export interface RootState {
  user: UserState;
  sorting: SortingState[];
}
