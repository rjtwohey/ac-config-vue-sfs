const canRefresh = jest.fn().mockResolvedValue(false);
const getAccessToken = jest.fn().mockResolvedValue(undefined);
const getConfig = jest.fn().mockResolvedValue(undefined);
const getFlow = jest.fn().mockResolvedValue(undefined);
const getProvider = jest.fn().mockResolvedValue(undefined);
const isAccessTokenExpired = jest.fn().mockResolvedValue(false);
const isAuthenticated = jest.fn().mockResolvedValue(false);
const login = jest.fn().mockResolvedValue(undefined);
const logout = jest.fn().mockResolvedValue(undefined);
const refresh = jest.fn().mockResolvedValue(undefined);
const setConfig = jest.fn().mockResolvedValue(undefined);

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
