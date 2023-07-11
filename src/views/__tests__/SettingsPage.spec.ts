import { useAuthConfig } from '@/composables/auth-config';
import { useAuthConnect } from '@/composables/auth-connect';
import { useAuthFlows } from '@/composables/auth-flows';
import { useAuthProviders } from '@/composables/auth-providers';
import SettingsPage from '@/views/SettingsPage.vue';
import { IonTitle, isPlatform } from '@ionic/vue';
import { flushPromises, mount, VueWrapper } from '@vue/test-utils';
import WrapperLike from '@vue/test-utils/dist/interfaces/wrapperLike';
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import { createRouter, createWebHistory, Router } from 'vue-router';

vi.mock('@/composables/auth-connect');
vi.mock('@ionic/vue', async () => {
  const actual = (await vi.importActual('@ionic/vue')) as any;
  return { ...actual, isPlatform: vi.fn() };
});

describe('settings page', () => {
  let router: Router;

  const mountView = async (): Promise<VueWrapper<any>> => {
    router = createRouter({
      history: createWebHistory(process.env.BASE_URL),
      routes: [{ path: '/', component: SettingsPage }],
    });
    router.push('/');
    await router.isReady();
    const wrapper = mount(SettingsPage, {
      global: {
        plugins: [router],
      },
    });
    await flushPromises();
    return wrapper;
  };

  beforeEach(() => {
    vi.resetAllMocks();

    const { getConfig, getProvider, getFlow } = useAuthConnect();
    const { auth0Config } = useAuthConfig();
    const { providers } = useAuthProviders();
    const { flows } = useAuthFlows();

    (getConfig as Mock).mockResolvedValue({
      ...auth0Config,
    });
    (getProvider as Mock).mockResolvedValue({
      ...providers.find((p) => p.key === 'auth0'),
    });
    (getFlow as Mock).mockResolvedValue({
      ...flows.find((p) => p.key === 'PKCE'),
    });

    (isPlatform as Mock).mockReturnValue(false);
  });

  it('renders', async () => {
    const wrapper = await mountView();
    expect(wrapper.exists()).toBe(true);
  });

  it('has the correct title', async () => {
    const wrapper = await mountView();
    const title = wrapper.findComponent(IonTitle);
    expect(title.text()).toBe('Settings');
  });

  describe('when logged in', () => {
    beforeEach(() => {
      const { isAuthenticated } = useAuthConnect();
      (isAuthenticated as Mock).mockResolvedValue(true);
    });

    it('displays a message to logout first', async () => {
      const wrapper = await mountView();
      const label = wrapper.find('[data-testid="logout-message"]');
      expect(label.exists()).toBe(true);
      expect(label.text().trim()).toBe('Please log out first');
    });

    it('does not allow swaps', async () => {
      const wrapper = await mountView();
      let button = wrapper.findComponent('[data-testid="use-azure"]');
      expect((button.element as HTMLButtonElement).disabled).toBe(true);
      button = wrapper.findComponent('[data-testid="use-aws"]');
      expect((button.element as HTMLButtonElement).disabled).toBe(true);
      button = wrapper.findComponent('[data-testid="use-auth0"]');
      expect((button.element as HTMLButtonElement).disabled).toBe(true);
      button = wrapper.findComponent('[data-testid="use-okta"]');
      expect((button.element as HTMLButtonElement).disabled).toBe(true);
      button = wrapper.findComponent('[data-testid="use-customization"]');
      expect((button.element as HTMLButtonElement).disabled).toBe(true);
    });

    describe('client ID', () => {
      let input: WrapperLike;
      beforeEach(async () => {
        const wrapper = await mountView();
        input = wrapper.findComponent('[data-testid="client-id-input"]');
      });

      it('is initialized', () => {
        const { auth0Config } = useAuthConfig();
        expect((input.element as HTMLInputElement).value).toEqual(auth0Config.clientId);
      });

      it('is disabled', () => {
        expect((input.element as HTMLInputElement).disabled).toEqual(true);
      });
    });

    describe('discovery URL', () => {
      let input: WrapperLike;
      beforeEach(async () => {
        const wrapper = await mountView();
        input = wrapper.findComponent('[data-testid="discovery-url-input"]');
      });

      it('is initialized', () => {
        const { auth0Config } = useAuthConfig();
        expect((input.element as HTMLInputElement).value).toEqual(auth0Config.discoveryUrl);
      });

      it('is disabled', () => {
        expect((input.element as HTMLInputElement).disabled).toEqual(true);
      });
    });

    describe('scope', () => {
      let input: WrapperLike;
      beforeEach(async () => {
        const wrapper = await mountView();
        input = wrapper.findComponent('[data-testid="scope-input"]');
      });

      it('is initialized', () => {
        const { auth0Config } = useAuthConfig();
        expect((input.element as HTMLInputElement).value).toEqual(auth0Config.scope);
      });

      it('is disabled', () => {
        expect((input.element as HTMLInputElement).disabled).toEqual(true);
      });
    });

    describe('audience', () => {
      let input: WrapperLike;
      beforeEach(async () => {
        const wrapper = await mountView();
        input = wrapper.findComponent('[data-testid="audience-input"]');
      });

      it('is initialized', () => {
        const { auth0Config } = useAuthConfig();
        expect((input.element as HTMLInputElement).value).toEqual(auth0Config.audience);
      });

      it('is disabled', () => {
        expect((input.element as HTMLInputElement).disabled).toEqual(true);
      });
    });
  });

  describe('when not logged in', () => {
    beforeEach(async () => {
      const { isAuthenticated } = useAuthConnect();
      (isAuthenticated as Mock).mockResolvedValue(false);
    });

    it('does not display a message to logout first', async () => {
      const wrapper = await mountView();
      const label = wrapper.find('[data-testid="logout-message"]');
      expect(label.exists()).toBe(false);
    });

    it('allows swaps', async () => {
      const wrapper = await mountView();
      let button = wrapper.findComponent('[data-testid="use-azure"]');
      expect((button.element as HTMLButtonElement).disabled).toBe(false);
      button = wrapper.findComponent('[data-testid="use-aws"]');
      expect((button.element as HTMLButtonElement).disabled).toBe(false);
      button = wrapper.findComponent('[data-testid="use-auth0"]');
      expect((button.element as HTMLButtonElement).disabled).toBe(false);
      button = wrapper.findComponent('[data-testid="use-okta"]');
      expect((button.element as HTMLButtonElement).disabled).toBe(false);
      button = wrapper.findComponent('[data-testid="use-customization"]');
      expect((button.element as HTMLButtonElement).disabled).toBe(false);
    });

    describe('with a non-standard AUTH_URL_SCHEME', () => {
      beforeEach(() => {
        import.meta.env.VITE_AUTH_URL_SCHEME = 'com.acme.custom';
      });

      afterEach(() => {
        import.meta.env.VITE_AUTH_URL_SCHEME = 'msauth';
      });

      it('disables our big four templates', async () => {
        const wrapper = await mountView();
        let button = wrapper.findComponent('[data-testid="use-azure"]');
        expect((button.element as HTMLButtonElement).disabled).toBe(true);
        button = wrapper.findComponent('[data-testid="use-aws"]');
        expect((button.element as HTMLButtonElement).disabled).toBe(true);
        button = wrapper.findComponent('[data-testid="use-auth0"]');
        expect((button.element as HTMLButtonElement).disabled).toBe(true);
        button = wrapper.findComponent('[data-testid="use-okta"]');
        expect((button.element as HTMLButtonElement).disabled).toBe(true);
      });

      it('allows customization', async () => {
        const wrapper = await mountView();
        const button = wrapper.findComponent('[data-testid="use-customization"]');
        expect((button.element as HTMLButtonElement).disabled).toBe(false);
      });
    });

    describe('azure button', () => {
      let button: any;
      beforeEach(async () => {
        const wrapper = await mountView();
        button = wrapper.findComponent('[data-testid="use-azure"]');
      });

      describe('on the web', () => {
        beforeEach(() => {
          (isPlatform as Mock).mockReturnValue(false);
        });

        it('saves the config', async () => {
          const { setConfig } = useAuthConnect();
          const { flows } = useAuthFlows();
          const { providers } = useAuthProviders();
          const { azureConfig, webConfig } = useAuthConfig();
          await button.trigger('click');
          expect(setConfig).toHaveBeenCalledTimes(1);
          expect(setConfig).toHaveBeenCalledWith(
            providers.find((p) => p.key === 'azure'),
            { ...azureConfig, ...webConfig },
            flows.find((f) => f.key === 'implicit')
          );
        });
      });

      describe('on mobile', () => {
        beforeEach(() => {
          (isPlatform as Mock).mockReturnValue(true);
        });

        it('saves the config', async () => {
          const { setConfig } = useAuthConnect();
          const { providers } = useAuthProviders();
          const { azureConfig } = useAuthConfig();
          await button.trigger('click');
          expect(setConfig).toHaveBeenCalledTimes(1);
          expect(setConfig).toHaveBeenCalledWith(
            providers.find((p) => p.key === 'azure'),
            azureConfig,
            undefined
          );
        });
      });
    });

    describe('aws button', () => {
      let button: any;
      beforeEach(async () => {
        const wrapper = await mountView();
        button = wrapper.findComponent('[data-testid="use-aws"]');
      });

      describe('on web', () => {
        beforeEach(() => {
          (isPlatform as Mock).mockReturnValue(false);
        });

        it('saves the config', async () => {
          const { setConfig } = useAuthConnect();
          const { flows } = useAuthFlows();
          const { providers } = useAuthProviders();
          const { awsConfig, webConfig } = useAuthConfig();
          await button.trigger('click');
          expect(setConfig).toHaveBeenCalledTimes(1);
          expect(setConfig).toHaveBeenCalledWith(
            providers.find((p) => p.key === 'cognito'),
            { ...awsConfig, ...webConfig },
            flows.find((f) => f.key === 'PKCE')
          );
        });
      });

      describe('on mobile', () => {
        beforeEach(() => {
          (isPlatform as Mock).mockReturnValue(true);
        });

        it('saves the config', async () => {
          const { setConfig } = useAuthConnect();
          const { providers } = useAuthProviders();
          const { awsConfig } = useAuthConfig();
          await button.trigger('click');
          expect(setConfig).toHaveBeenCalledTimes(1);
          expect(setConfig).toHaveBeenCalledWith(
            providers.find((p) => p.key === 'cognito'),
            awsConfig,
            undefined
          );
        });
      });
    });

    describe('auth0 button', () => {
      let button: any;
      beforeEach(async () => {
        const wrapper = await mountView();
        button = wrapper.findComponent('[data-testid="use-auth0"]');
      });

      describe('on web', () => {
        beforeEach(() => {
          (isPlatform as Mock).mockReturnValue(false);
        });

        it('saves the config', async () => {
          const { setConfig } = useAuthConnect();
          const { flows } = useAuthFlows();
          const { providers } = useAuthProviders();
          const { auth0Config, webConfig } = useAuthConfig();
          await button.trigger('click');
          expect(setConfig).toHaveBeenCalledTimes(1);
          expect(setConfig).toHaveBeenCalledWith(
            providers.find((p) => p.key === 'auth0'),
            { ...auth0Config, ...webConfig },
            flows.find((f) => f.key === 'implicit')
          );
        });
      });

      describe('on mobile', () => {
        beforeEach(() => {
          (isPlatform as Mock).mockReturnValue(true);
        });

        it('saves the config', async () => {
          const { setConfig } = useAuthConnect();
          const { providers } = useAuthProviders();
          const { auth0Config } = useAuthConfig();
          await button.trigger('click');
          expect(setConfig).toHaveBeenCalledTimes(1);
          expect(setConfig).toHaveBeenCalledWith(
            providers.find((p) => p.key === 'auth0'),
            auth0Config,
            undefined
          );
        });
      });
    });

    describe('okta button', () => {
      let button: any;
      beforeEach(async () => {
        const wrapper = await mountView();
        button = wrapper.findComponent('[data-testid="use-okta"]');
      });

      describe('on web', () => {
        beforeEach(() => {
          (isPlatform as Mock).mockReturnValue(false);
        });

        it('saves the config', async () => {
          const { setConfig } = useAuthConnect();
          const { flows } = useAuthFlows();
          const { providers } = useAuthProviders();
          const { oktaConfig, webConfig } = useAuthConfig();
          await button.trigger('click');
          expect(setConfig).toHaveBeenCalledTimes(1);
          expect(setConfig).toHaveBeenCalledWith(
            providers.find((p) => p.key === 'okta'),
            { ...oktaConfig, ...webConfig },
            flows.find((f) => f.key === 'PKCE')
          );
        });
      });

      describe('on mobile', () => {
        beforeEach(() => {
          (isPlatform as Mock).mockReturnValue(true);
        });

        it('saves the config', async () => {
          const { setConfig } = useAuthConnect();
          const { providers } = useAuthProviders();
          const { oktaConfig } = useAuthConfig();
          await button.trigger('click');
          expect(setConfig).toHaveBeenCalledTimes(1);
          expect(setConfig).toHaveBeenCalledWith(
            providers.find((p) => p.key === 'okta'),
            oktaConfig,
            undefined
          );
        });
      });
    });

    describe('customize button', () => {
      let button: WrapperLike;
      let wrapper: WrapperLike;
      beforeEach(async () => {
        wrapper = await mountView();
        button = wrapper.findComponent('[data-testid="use-customization"]');
      });

      describe('on web', () => {
        beforeEach(() => {
          (isPlatform as Mock).mockReturnValue(false);
        });

        it('saves the config', async () => {
          const { flows } = useAuthFlows();
          const { providers } = useAuthProviders();
          const { setConfig } = useAuthConnect();
          let input = wrapper.findComponent('[data-testid="client-id-input"]');
          input.setValue('1994-9940fks');
          input = wrapper.findComponent('[data-testid="discovery-url-input"]');
          input.setValue('https://foo.bar.disco/.well-known/sticky-buns');
          input = wrapper.findComponent('[data-testid="scope-input"]');
          input.setValue('email offline');
          input = wrapper.findComponent('[data-testid="audience-input"]');
          input.setValue('people');
          input = wrapper.findComponent('[data-testid="flow-select"]');
          input.setValue(flows.find((f) => f.key === 'PKCE'));
          input = wrapper.findComponent('[data-testid="provider-select"]');
          input.setValue(providers.find((p) => p.key === 'onelogin'));
          await button.trigger('click');
          expect(setConfig).toHaveBeenCalledTimes(1);
          expect(setConfig).toHaveBeenCalledWith(
            providers.find((p) => p.key === 'onelogin'),
            {
              clientId: '1994-9940fks',
              discoveryUrl: 'https://foo.bar.disco/.well-known/sticky-buns',
              logoutUrl: 'http://localhost:8100/auth-action-complete',
              redirectUri: 'http://localhost:8100/auth-action-complete',
              scope: 'email offline',
              audience: 'people',
            },
            flows.find((f) => f.key === 'PKCE')
          );
        });
      });

      describe('on mobile', () => {
        beforeEach(() => {
          (isPlatform as Mock).mockReturnValue(true);
        });

        it('saves the config', async () => {
          const { providers } = useAuthProviders();
          const { setConfig } = useAuthConnect();
          let input = wrapper.findComponent('[data-testid="client-id-input"]');
          input.setValue('1994-9940fks');
          input = wrapper.findComponent('[data-testid="discovery-url-input"]');
          input.setValue('https://foo.bar.disco/.well-known/sticky-buns');
          input = wrapper.findComponent('[data-testid="scope-input"]');
          input.setValue('email offline');
          input = wrapper.findComponent('[data-testid="audience-input"]');
          input.setValue('people');
          input = wrapper.findComponent('[data-testid="flow-select"]');
          input.setValue(undefined);
          input = wrapper.findComponent('[data-testid="provider-select"]');
          input.setValue(providers.find((p) => p.key === 'onelogin'));
          await button.trigger('click');
          expect(setConfig).toHaveBeenCalledTimes(1);
          expect(setConfig).toHaveBeenCalledWith(
            providers.find((p) => p.key === 'onelogin'),
            {
              clientId: '1994-9940fks',
              discoveryUrl: 'https://foo.bar.disco/.well-known/sticky-buns',
              logoutUrl: 'msauth://auth-action-complete',
              redirectUri: 'msauth://auth-action-complete',
              scope: 'email offline',
              audience: 'people',
            },
            undefined
          );
        });
      });
    });

    describe('client ID', () => {
      let input: WrapperLike;
      beforeEach(async () => {
        const wrapper = await mountView();
        input = wrapper.findComponent('[data-testid="client-id-input"]');
      });

      it('is initialized', async () => {
        const { auth0Config } = useAuthConfig();
        expect((input.element as HTMLInputElement).value).toEqual(auth0Config.clientId);
      });

      it('is enabled', () => {
        expect((input.element as HTMLInputElement).disabled).toEqual(false);
      });
    });

    describe('discovery URL', () => {
      let input: WrapperLike;
      beforeEach(async () => {
        const wrapper = await mountView();
        input = wrapper.findComponent('[data-testid="discovery-url-input"]');
      });

      it('is initialized', () => {
        const { auth0Config } = useAuthConfig();
        expect((input.element as HTMLInputElement).value).toEqual(auth0Config.discoveryUrl);
      });

      it('is enabled', () => {
        expect((input.element as HTMLInputElement).disabled).toEqual(false);
      });
    });

    describe('scope', () => {
      let input: WrapperLike;
      beforeEach(async () => {
        const wrapper = await mountView();
        input = wrapper.findComponent('[data-testid="scope-input"]');
      });

      it('is initialized', () => {
        const { auth0Config } = useAuthConfig();
        expect((input.element as HTMLInputElement).value).toEqual(auth0Config.scope);
      });

      it('is enabled', () => {
        expect((input.element as HTMLInputElement).disabled).toEqual(false);
      });
    });

    describe('audience', () => {
      let input: WrapperLike;
      beforeEach(async () => {
        const wrapper = await mountView();
        input = wrapper.findComponent('[data-testid="audience-input"]');
      });

      it('is initialized', () => {
        const { auth0Config } = useAuthConfig();
        expect((input.element as HTMLInputElement).value).toEqual(auth0Config.audience);
      });

      it('is enabled', () => {
        expect((input.element as HTMLInputElement).disabled).toEqual(false);
      });
    });
  });
});
