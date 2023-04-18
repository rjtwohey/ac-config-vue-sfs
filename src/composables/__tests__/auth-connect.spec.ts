import { useAuthConfig } from '@/composables/auth-config';
import { useAuthConnect } from '@/composables/auth-connect';
import { useAuthFlows } from '@/composables/auth-flows';
import { useAuthProviders } from '@/composables/auth-providers';
import { Preferences } from '@capacitor/preferences';
import { AuthConnect, AzureProvider, CognitoProvider, ProviderOptions } from '@ionic-enterprise/auth';
import { isPlatform } from '@ionic/vue';
import { Mock, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@capacitor/preferences');
vi.mock('@ionic-enterprise/auth');
vi.mock('@ionic/vue', async () => {
  const actual = (await vi.importActual('@ionic/vue')) as any;
  return { ...actual, isPlatform: vi.fn().mockReturnValue(true) };
});

describe('auth connect', () => {
  let authResult: string | null;
  const opt: ProviderOptions = {
    clientId: '4273afw',
    discoveryUrl: 'https://some.azure.server/.well-known/openid-configuration',
    redirectUri: 'msauth://login',
    logoutUrl: 'msauth://login',
    scope: 'openid email profile',
    audience: 'all-the-users',
  };

  const setupAuthConfig = () => {
    const { azureConfig } = useAuthConfig();
    const { flows } = useAuthFlows();
    const { providers } = useAuthProviders();
    (Preferences.get as Mock).mockImplementation(async (arg: { key: string }) => {
      if (arg.key === 'auth-provider') {
        return { value: JSON.stringify(providers.find((p) => p.key === 'azure')) };
      }

      if (arg.key === 'auth-provider-options') {
        return { value: JSON.stringify(azureConfig) };
      }

      if (arg.key === 'auth-flow') {
        return { value: JSON.stringify(flows[0]) };
      }

      if (arg.key === 'auth-result') {
        return { value: authResult };
      }

      return { value: null };
    });
  };

  beforeEach(() => {
    vi.resetAllMocks();
    (Preferences.get as Mock).mockResolvedValue({ value: null });
    const { clearCache } = useAuthConnect();
    clearCache();
  });

  describe('can refresh', () => {
    beforeEach(() => {
      authResult = JSON.stringify({
        accessToken: 'the-access-token',
        refreshToken: 'the-refresh-token',
        idToken: 'the-id-token',
      });
      setupAuthConfig();
    });

    it('resolves false if the refresh token is not available', async () => {
      const { canRefresh } = useAuthConnect();
      (AuthConnect.isRefreshTokenAvailable as Mock).mockResolvedValue(false);
      expect(await canRefresh()).toEqual(false);
    });

    it('resolves true if the token is available', async () => {
      const { canRefresh } = useAuthConnect();
      (AuthConnect.isRefreshTokenAvailable as Mock).mockResolvedValue(true);
      expect(await canRefresh()).toEqual(true);
    });

    it('resolves false if there is no access token', async () => {
      const { canRefresh } = useAuthConnect();
      authResult = null;
      expect(await canRefresh()).toBe(false);
    });
  });

  describe('get access token', () => {
    beforeEach(() => {
      authResult = JSON.stringify({
        accessToken: 'the-access-token',
        refreshToken: 'the-refresh-token',
        idToken: 'the-id-token',
      });
      setupAuthConfig();
    });

    it('resolves the token', async () => {
      const { getAccessToken } = useAuthConnect();
      expect(await getAccessToken()).toEqual('the-access-token');
    });

    it('resolves undefined if there is no access token', async () => {
      const { getAccessToken } = useAuthConnect();
      authResult = null;
      expect(await getAccessToken()).toBeUndefined();
    });
  });

  describe('get config', () => {
    it('fetches the config from storage', async () => {
      const { getConfig } = useAuthConnect();
      (Preferences.get as Mock).mockResolvedValue({ value: JSON.stringify(opt) });
      await getConfig();
      expect(Preferences.get).toHaveBeenCalledTimes(1);
      expect(Preferences.get).toHaveBeenCalledWith({
        key: 'auth-provider-options',
      });
    });

    it('caches the config', async () => {
      const { getConfig } = useAuthConnect();
      (Preferences.get as Mock).mockResolvedValue({ value: JSON.stringify(opt) });
      await getConfig();
      await getConfig();
      expect(Preferences.get).toHaveBeenCalledTimes(1);
    });

    it('resolves the value', async () => {
      const { getConfig } = useAuthConnect();
      (Preferences.get as Mock).mockResolvedValue({ value: JSON.stringify(opt) });
      expect(await getConfig()).toEqual(opt);
    });

    it('resolves undefined if there is no value', async () => {
      const { getConfig } = useAuthConnect();
      (Preferences.get as Mock).mockResolvedValue({ value: null });
      expect(await getConfig()).toBeUndefined();
    });
  });

  describe('get flow', () => {
    it('fetches the flow from storage', async () => {
      const { getFlow } = useAuthConnect();
      const { flows } = useAuthFlows();
      (Preferences.get as Mock).mockResolvedValue({
        value: JSON.stringify(flows[0]),
      });
      await getFlow();
      expect(Preferences.get).toHaveBeenCalledTimes(1);
      expect(Preferences.get).toHaveBeenCalledWith({
        key: 'auth-flow',
      });
    });

    it('caches the flow', async () => {
      const { getFlow } = useAuthConnect();
      const { flows } = useAuthFlows();
      (Preferences.get as Mock).mockResolvedValue({
        value: JSON.stringify(flows[0]),
      });
      await getFlow();
      await getFlow();
      expect(Preferences.get).toHaveBeenCalledTimes(1);
    });

    it('resolves the value', async () => {
      const { getFlow } = useAuthConnect();
      const { flows } = useAuthFlows();
      (Preferences.get as Mock).mockResolvedValue({
        value: JSON.stringify(flows[0]),
      });
      expect(await getFlow()).toEqual(flows[0]);
    });

    it('resolves undefined if there is no value', async () => {
      const { getFlow } = useAuthConnect();
      (Preferences.get as Mock).mockResolvedValue({ value: null });
      expect(await getFlow()).toBeUndefined();
    });
  });

  describe('get provider', () => {
    it('fetches the provider from storage', async () => {
      const { getProvider } = useAuthConnect();
      const { providers } = useAuthProviders();
      (Preferences.get as Mock).mockResolvedValue({
        value: JSON.stringify(providers[0]),
      });
      await getProvider();
      expect(Preferences.get).toHaveBeenCalledTimes(1);
      expect(Preferences.get).toHaveBeenCalledWith({
        key: 'auth-provider',
      });
    });

    it('caches the provider', async () => {
      const { getProvider } = useAuthConnect();
      const { providers } = useAuthProviders();
      (Preferences.get as Mock).mockResolvedValue({
        value: JSON.stringify(providers[0]),
      });
      await getProvider();
      await getProvider();
      expect(Preferences.get).toHaveBeenCalledTimes(1);
    });

    it('resolves the value', async () => {
      const { getProvider } = useAuthConnect();
      const { providers } = useAuthProviders();
      (Preferences.get as Mock).mockResolvedValue({
        value: JSON.stringify(providers[2]),
      });
      expect(await getProvider()).toEqual(providers[2]);
    });

    it('resolves undefined if there is no value', async () => {
      const { getProvider } = useAuthConnect();
      (Preferences.get as Mock).mockResolvedValue({ value: null });
      expect(await getProvider()).toBeUndefined();
    });
  });

  describe('is access token expired', () => {
    beforeEach(() => {
      authResult = JSON.stringify({
        accessToken: 'the-access-token',
        refreshToken: 'the-refresh-token',
        idToken: 'the-id-token',
      });
      setupAuthConfig();
    });

    it('resolves false if the token is not expired', async () => {
      const { isAccessTokenExpired } = useAuthConnect();
      (AuthConnect.isAccessTokenExpired as Mock).mockResolvedValue(false);
      expect(await isAccessTokenExpired()).toEqual(false);
    });

    it('resolves true if the token is expired', async () => {
      const { isAccessTokenExpired } = useAuthConnect();
      (AuthConnect.isAccessTokenExpired as Mock).mockResolvedValue(true);
      expect(await isAccessTokenExpired()).toEqual(true);
    });

    it('resolves false if there is no access token', async () => {
      const { isAccessTokenExpired } = useAuthConnect();
      authResult = null;
      expect(await isAccessTokenExpired()).toBe(false);
    });
  });

  describe('is authenticated', () => {
    beforeEach(() => {
      authResult = JSON.stringify({
        accessToken: 'the-access-token',
        refreshToken: 'the-refresh-token',
        idToken: 'the-id-token',
      });
      setupAuthConfig();
    });

    it('is true when there is an auth-result and an access token is available', async () => {
      const { isAuthenticated } = useAuthConnect();
      (AuthConnect.isAccessTokenAvailable as Mock).mockResolvedValue(true);
      expect(await isAuthenticated()).toBe(true);
    });

    it('is false when there is an auth-result and an access token is not available', async () => {
      const { isAuthenticated } = useAuthConnect();
      (AuthConnect.isAccessTokenAvailable as Mock).mockResolvedValue(false);
      expect(await isAuthenticated()).toBe(false);
    });

    it('is false if there is no auth result', async () => {
      const { isAuthenticated } = useAuthConnect();
      authResult = null;
      expect(await isAuthenticated()).toBe(false);
    });
  });

  // Note: the same init routine is followed with each method, but is only fully
  //       tested in the login
  describe('login', () => {
    beforeEach(() => {
      (isPlatform as Mock).mockReturnValue(true);
      (AuthConnect.login as Mock).mockResolvedValue({
        accessToken: 'the-access-token',
        refreshToken: 'the-refresh-token',
        idToken: 'the-id-token',
      });
    });

    describe('with nothing saved', () => {
      beforeEach(() => {
        (Preferences.get as Mock).mockResolvedValue({ value: null });
      });

      it('gets the config', async () => {
        const { login } = useAuthConnect();
        await login();
        expect(Preferences.get).toHaveBeenCalledTimes(2);
        expect(Preferences.get).toHaveBeenCalledWith({
          key: 'auth-provider-options',
        });
        expect(Preferences.get).toHaveBeenCalledWith({
          key: 'auth-flow',
        });
      });

      it('runs the init once', async () => {
        const { login } = useAuthConnect();
        await login();
        await login();
        expect(Preferences.get).toHaveBeenCalledTimes(2);
      });

      it('creates with Cognito', async () => {
        const { awsConfig } = useAuthConfig();
        const { providers } = useAuthProviders();
        const { login } = useAuthConnect();
        await login();
        expect(Preferences.set).toHaveBeenCalledWith({
          key: 'auth-provider',
          value: JSON.stringify(providers.find((p) => p.key === 'cognito')),
        });
        expect(Preferences.set).toHaveBeenCalledWith({
          key: 'auth-provider-options',
          value: JSON.stringify(awsConfig),
        });
      });

      it('performs the login', async () => {
        const { awsConfig } = useAuthConfig();
        const { login } = useAuthConnect();
        await login();
        expect(AuthConnect.login).toHaveBeenCalledTimes(1);
        expect(AuthConnect.login).toHaveBeenCalledWith(expect.any(CognitoProvider), awsConfig);
      });

      it('save the auth result', async () => {
        const { login } = useAuthConnect();
        await login();
        expect(Preferences.set).toHaveBeenCalledTimes(3);
        expect(Preferences.set).toHaveBeenCalledWith({
          key: 'auth-result',
          value: JSON.stringify({
            accessToken: 'the-access-token',
            refreshToken: 'the-refresh-token',
            idToken: 'the-id-token',
          }),
        });
      });

      describe('on web', () => {
        beforeEach(() => {
          (isPlatform as Mock).mockReturnValue(false);
        });

        it('creates with Cognito', async () => {
          const { awsConfig } = useAuthConfig();
          const { flows } = useAuthFlows();
          const { providers } = useAuthProviders();
          const { login } = useAuthConnect();
          await login();
          expect(Preferences.set).toHaveBeenCalledWith({
            key: 'auth-provider',
            value: JSON.stringify(providers.find((p) => p.key === 'cognito')),
          });
          expect(Preferences.set).toHaveBeenCalledWith({
            key: 'auth-provider-options',
            value: JSON.stringify({
              ...awsConfig,
              redirectUri: 'http://localhost:8100/login',
              logoutUrl: 'http://localhost:8100/login',
            }),
          });
          expect(Preferences.set).toHaveBeenCalledWith({
            key: 'auth-flow',
            value: JSON.stringify(flows.find((f) => f.key === 'PKCE')),
          });
        });

        it('performs the login', async () => {
          const { awsConfig, webConfig } = useAuthConfig();
          const { login } = useAuthConnect();
          await login();
          expect(AuthConnect.login).toHaveBeenCalledTimes(1);
          expect(AuthConnect.login).toHaveBeenCalledWith(expect.any(CognitoProvider), { ...awsConfig, ...webConfig });
        });

        it('save the auth result', async () => {
          const { login } = useAuthConnect();
          await login();
          expect(Preferences.set).toHaveBeenCalledTimes(4);
          expect(Preferences.set).toHaveBeenCalledWith({
            key: 'auth-result',
            value: JSON.stringify({
              accessToken: 'the-access-token',
              refreshToken: 'the-refresh-token',
              idToken: 'the-id-token',
            }),
          });
        });
      });
    });

    describe('with saved data', () => {
      beforeEach(() => {
        authResult = null;
        setupAuthConfig();
      });

      it('gets all of the things', async () => {
        const { login } = useAuthConnect();
        await login();
        expect(Preferences.get).toHaveBeenCalledTimes(4);
        expect(Preferences.get).toHaveBeenCalledWith({
          key: 'auth-provider-options',
        });
        expect(Preferences.get).toHaveBeenCalledWith({
          key: 'auth-provider',
        });
        expect(Preferences.get).toHaveBeenCalledWith({
          key: 'auth-flow',
        });
        expect(Preferences.get).toHaveBeenCalledWith({
          key: 'auth-result',
        });
      });

      it('performs the login', async () => {
        const { login } = useAuthConnect();
        await login();
        expect(AuthConnect.login).toHaveBeenCalledTimes(1);
      });

      it('does not perform the login if there is any auth result', async () => {
        const { login } = useAuthConnect();
        authResult = JSON.stringify({
          accessToken: 'the-access-token',
          refreshToken: 'the-refresh-token',
          idToken: 'the-id-token',
        });
        await login();
        expect(AuthConnect.login).not.toHaveBeenCalled();
      });
    });
  });

  describe('logout', () => {
    beforeEach(() => {
      authResult = JSON.stringify({
        accessToken: 'the-access-token',
        refreshToken: 'the-refresh-token',
        idToken: 'the-id-token',
      });
      setupAuthConfig();
    });

    it('performs the logout', async () => {
      const { logout } = useAuthConnect();
      await logout();
      expect(AuthConnect.logout).toHaveBeenCalledTimes(1);
      expect(AuthConnect.logout).toHaveBeenCalledWith(expect.any(AzureProvider), {
        accessToken: 'the-access-token',
        refreshToken: 'the-refresh-token',
        idToken: 'the-id-token',
      } as any);
    });

    it('removes the auth result', async () => {
      const { logout } = useAuthConnect();
      await logout();
      expect(Preferences.remove).toHaveBeenCalledTimes(1);
      expect(Preferences.remove).toHaveBeenCalledWith({ key: 'auth-result' });
    });

    it('does not perform the logout if there is no auth result', async () => {
      const { logout } = useAuthConnect();
      authResult = null;
      await logout();
      expect(AuthConnect.logout).not.toHaveBeenCalled();
    });
  });

  describe('refresh', () => {
    beforeEach(() => {
      authResult = JSON.stringify({
        accessToken: 'the-access-token',
        refreshToken: 'the-refresh-token',
        idToken: 'the-id-token',
      });
      setupAuthConfig();
    });

    it('performs the refresh of the session', async () => {
      const { refresh } = useAuthConnect();
      (AuthConnect.refreshSession as Mock).mockResolvedValue({
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
        idToken: 'new-id-token',
      });
      await refresh();
      expect(AuthConnect.refreshSession).toHaveBeenCalledTimes(1);
      expect(AuthConnect.refreshSession).toHaveBeenCalledWith(expect.any(AzureProvider), {
        accessToken: 'the-access-token',
        refreshToken: 'the-refresh-token',
        idToken: 'the-id-token',
      } as any);
    });

    it('saves the new auth results', async () => {
      const { refresh } = useAuthConnect();
      (AuthConnect.refreshSession as Mock).mockResolvedValue({
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
        idToken: 'new-id-token',
      });
      await refresh();
      expect(Preferences.set).toHaveBeenCalledTimes(1);
      expect(Preferences.set).toHaveBeenCalledWith({
        key: 'auth-result',
        value: JSON.stringify({
          accessToken: 'new-access-token',
          refreshToken: 'new-refresh-token',
          idToken: 'new-id-token',
        }),
      });
    });

    it('uses the new auth results', async () => {
      const { logout, refresh } = useAuthConnect();
      (AuthConnect.refreshSession as Mock).mockResolvedValue({
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
        idToken: 'new-id-token',
      });
      await refresh();
      await logout();
      expect(AuthConnect.logout).toHaveBeenCalledWith(expect.any(AzureProvider), {
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
        idToken: 'new-id-token',
      } as any);
    });

    it('does not refresh the session if there is no auth result', async () => {
      const { refresh } = useAuthConnect();
      authResult = null;
      await refresh();
      expect(AuthConnect.refreshSession).not.toHaveBeenCalled();
    });
  });

  describe('set config', () => {
    it('sets up AC for mobile', async () => {
      const { setConfig } = useAuthConnect();
      const { providers } = useAuthProviders();
      (isPlatform as Mock).mockReturnValue(true);
      await setConfig(providers[3], opt);
      expect(AuthConnect.setup).toHaveBeenCalledTimes(1);
      expect(AuthConnect.setup).toHaveBeenCalledWith({
        platform: 'capacitor',
        logLevel: 'DEBUG',
        ios: {
          webView: 'private',
        },
        web: {
          uiMode: 'popup',
          authFlow: 'implicit',
        },
      });
    });

    it('sets up AC for web', async () => {
      const { setConfig } = useAuthConnect();
      const { providers } = useAuthProviders();
      (isPlatform as Mock).mockReturnValue(false);
      await setConfig(providers[3], opt);
      expect(AuthConnect.setup).toHaveBeenCalledTimes(1);
      expect(AuthConnect.setup).toHaveBeenCalledWith({
        platform: 'web',
        logLevel: 'DEBUG',
        ios: {
          webView: 'private',
        },
        web: {
          uiMode: 'popup',
          authFlow: 'implicit',
        },
      });
    });

    describe('without a flow', () => {
      it('saves the provider and provider options', async () => {
        const { setConfig } = useAuthConnect();
        const { providers } = useAuthProviders();
        await setConfig(providers[3], opt);
        expect(Preferences.set).toHaveBeenCalledTimes(2);
        expect(Preferences.set).toHaveBeenCalledWith({
          key: 'auth-provider',
          value: JSON.stringify(providers[3]),
        });
        expect(Preferences.set).toHaveBeenCalledWith({
          key: 'auth-provider-options',
          value: JSON.stringify(opt),
        });
      });

      it('removes any flow', async () => {
        const { setConfig } = useAuthConnect();
        const { providers } = useAuthProviders();
        await setConfig(providers[3], opt);
        expect(Preferences.remove).toHaveBeenCalledTimes(1);
        expect(Preferences.remove).toHaveBeenCalledWith({
          key: 'auth-flow',
        });
      });
    });

    describe('with a flow', () => {
      it('saves the provider, provider options, and flow', async () => {
        const { setConfig } = useAuthConnect();
        const { providers } = useAuthProviders();
        const { flows } = useAuthFlows();
        await setConfig(providers[3], opt, flows[1]);
        expect(Preferences.set).toHaveBeenCalledTimes(3);
        expect(Preferences.set).toHaveBeenCalledWith({
          key: 'auth-provider',
          value: JSON.stringify(providers[3]),
        });
        expect(Preferences.set).toHaveBeenCalledWith({
          key: 'auth-provider-options',
          value: JSON.stringify(opt),
        });
        expect(Preferences.set).toHaveBeenCalledWith({
          key: 'auth-flow',
          value: JSON.stringify(flows[1]),
        });
      });

      it('does not remove anything', async () => {
        const { setConfig } = useAuthConnect();
        const { providers } = useAuthProviders();
        const { flows } = useAuthFlows();
        await setConfig(providers[3], opt, flows[1]);
        expect(Preferences.remove).not.toHaveBeenCalled();
      });

      it('uses specified flow in web setup', async () => {
        const { setConfig } = useAuthConnect();
        const { providers } = useAuthProviders();
        const { flows } = useAuthFlows();
        (isPlatform as Mock).mockReturnValue(false);
        await setConfig(
          providers[3],
          opt,
          flows.find((f) => f.key === 'PKCE')
        );
        expect(AuthConnect.setup).toHaveBeenCalledTimes(1);
        expect(AuthConnect.setup).toHaveBeenCalledWith({
          platform: 'web',
          logLevel: 'DEBUG',
          ios: {
            webView: 'private',
          },
          web: {
            uiMode: 'popup',
            authFlow: 'PKCE',
          },
        });
      });
    });
  });
});
