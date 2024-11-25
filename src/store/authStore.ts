import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Account {
  id: string;
  username: string;
  profileImage: string;
  boardsCount: number;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

interface AuthState {
  accounts: Account[];
  currentAccount: string | null;
  isAuthenticated: boolean;
  error: string | null;
  accessToken: string | null;
  refreshToken: string | null;
  expiresIn: number | null;
  setAuth: (auth: Partial<AuthState>) => void;
  clearAuth: () => void;
  setCurrentAccount: (accountId: string) => void;
  addAccount: (account: Account) => void;
  removeAccount: (accountId: string) => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accounts: [],
      currentAccount: null,
      accessToken: null,
      refreshToken: null,
      expiresIn: null,
      isAuthenticated: false,
      error: null,

      setAuth: (auth) => set((state) => ({ ...state, ...auth })),
      clearAuth: () => set({
        accounts: [],
        currentAccount: null,
        accessToken: null,
        refreshToken: null,
        expiresIn: null,
        isAuthenticated: false,
        error: null,
      }),
      setCurrentAccount: (accountId) => set((state) => {
        const account = state.accounts.find(a => a.id === accountId);
        if (!account) return state;
        return {
          ...state,
          currentAccount: accountId,
          accessToken: account.accessToken,
          refreshToken: account.refreshToken,
          expiresIn: account.expiresIn,
        };
      }),
      addAccount: (account) => set((state) => ({
        accounts: [...state.accounts.filter(a => a.id !== account.id), account],
        currentAccount: account.id,
        accessToken: account.accessToken,
        refreshToken: account.refreshToken,
        expiresIn: account.expiresIn,
        isAuthenticated: true,
      })),
      removeAccount: (accountId) => set((state) => {
        const newAccounts = state.accounts.filter(a => a.id !== accountId);
        const newCurrentAccount = state.currentAccount === accountId
          ? newAccounts[0]?.id || null
          : state.currentAccount;
        
        return {
          ...state,
          accounts: newAccounts,
          currentAccount: newCurrentAccount,
          isAuthenticated: newAccounts.length > 0,
          accessToken: newCurrentAccount 
            ? newAccounts.find(a => a.id === newCurrentAccount)?.accessToken || null 
            : null,
          refreshToken: newCurrentAccount
            ? newAccounts.find(a => a.id === newCurrentAccount)?.refreshToken || null
            : null,
          expiresIn: newCurrentAccount
            ? newAccounts.find(a => a.id === newCurrentAccount)?.expiresIn || null
            : null,
        };
      }),
    }),
    {
      name: 'pinterest-auth',
    }
  )
);

export default useAuthStore;