import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface TelegramConfig {
  botToken: string;
  authorizedUsers: Array<{
    id: string;
    username: string;
    firstName: string;
  }>;
}

export type CacheDuration = '5min' | '12h' | 'infinite';

interface SettingsState {
  airtableToken: string;
  airtableBase: string;
  airtableTable: string;
  telegram: TelegramConfig;
  darkMode: boolean;
  cacheDuration: CacheDuration;
  isConfigured: boolean;
  setAirtableConfig: (token: string, base: string, table: string) => void;
  setTelegramConfig: (config: Partial<TelegramConfig>) => void;
  addTelegramUser: (user: TelegramConfig['authorizedUsers'][0]) => void;
  removeTelegramUser: (userId: string) => void;
  toggleDarkMode: () => void;
  setCacheDuration: (duration: CacheDuration) => void;
  clearConfig: () => void;
}

const initialTelegramConfig: TelegramConfig = {
  botToken: '',
  authorizedUsers: [],
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      airtableToken: '',
      airtableBase: '',
      airtableTable: '',
      telegram: initialTelegramConfig,
      darkMode: false,
      cacheDuration: '12h',
      isConfigured: false,
      setAirtableConfig: (token, base, table) =>
        set({ airtableToken: token, airtableBase: base, airtableTable: table, isConfigured: true }),
      setTelegramConfig: (config) =>
        set((state) => ({
          telegram: {
            ...state.telegram || initialTelegramConfig,
            ...config,
            authorizedUsers: state.telegram?.authorizedUsers || []
          }
        })),
      addTelegramUser: (user) =>
        set((state) => {
          const currentUsers = state.telegram?.authorizedUsers || [];
          return {
            telegram: {
              ...state.telegram || initialTelegramConfig,
              authorizedUsers: [...currentUsers.filter(u => u.id !== user.id), user]
            }
          };
        }),
      removeTelegramUser: (userId) =>
        set((state) => {
          const currentUsers = state.telegram?.authorizedUsers || [];
          return {
            telegram: {
              ...state.telegram || initialTelegramConfig,
              authorizedUsers: currentUsers.filter(user => user.id !== userId)
            }
          };
        }),
      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
      setCacheDuration: (duration) => set({ cacheDuration: duration }),
      clearConfig: () =>
        set({ 
          airtableToken: '', 
          airtableBase: '', 
          airtableTable: '', 
          telegram: initialTelegramConfig, 
          isConfigured: false 
        }),
    }),
    {
      name: 'taskflow-settings',
      partialize: (state) => ({
        airtableToken: state.airtableToken,
        airtableBase: state.airtableBase,
        airtableTable: state.airtableTable,
        telegram: state.telegram || initialTelegramConfig,
        darkMode: state.darkMode,
        cacheDuration: state.cacheDuration,
        isConfigured: state.isConfigured,
      }),
    }
  )
);