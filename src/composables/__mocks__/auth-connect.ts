import { vi } from 'vitest';

const canRefresh = vi.fn().mockResolvedValue(false);
const getAccessToken = vi.fn().mockResolvedValue(undefined);
const getConfig = vi.fn().mockResolvedValue(undefined);
const getFlow = vi.fn().mockResolvedValue(undefined);
const getProvider = vi.fn().mockResolvedValue(undefined);
const isAccessTokenExpired = vi.fn().mockResolvedValue(false);
const isAuthenticated = vi.fn().mockResolvedValue(false);
const login = vi.fn().mockResolvedValue(undefined);
const logout = vi.fn().mockResolvedValue(undefined);
const refresh = vi.fn().mockResolvedValue(undefined);
const setConfig = vi.fn().mockResolvedValue(undefined);

export const useAuthConnect = () => ({
  canRefresh,
  getAccessToken,
  getConfig,
  getFlow,
  getProvider,
  isAccessTokenExpired,
  isAuthenticated,
  login,
  logout,
  refresh,
  setConfig,
});
