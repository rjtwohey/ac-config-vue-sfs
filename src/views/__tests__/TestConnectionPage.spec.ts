import { useAuthConnect } from '@/composables/auth-connect';
import TestConnectionPage from '@/views/TestConnectionPage.vue';
import { IonTitle } from '@ionic/vue';
import { flushPromises, mount, VueWrapper } from '@vue/test-utils';
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import { createRouter, createWebHistory, Router } from 'vue-router';

vi.mock('@/composables/auth-connect');

describe('test connection page', () => {
  let router: Router;

  const mountView = async (): Promise<VueWrapper<any>> => {
    router = createRouter({
      history: createWebHistory(process.env.BASE_URL),
      routes: [{ path: '/', component: TestConnectionPage }],
    });
    router.push('/');
    await router.isReady();
    const wrapper = mount(TestConnectionPage, {
      global: {
        plugins: [router],
      },
    });
    await flushPromises();
    return wrapper;
  };

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('renders', async () => {
    const wrapper = await mountView();
    expect(wrapper.exists()).toBe(true);
  });

  it('has the correct title', async () => {
    const wrapper = await mountView();
    const title = wrapper.findComponent(IonTitle);
    expect(title.text()).toBe('Test Connection');
  });

  describe('when logged in', () => {
    beforeEach(() => {
      const { isAuthenticated, canRefresh } = useAuthConnect();
      (isAuthenticated as Mock).mockResolvedValue(true);
      (canRefresh as Mock).mockResolvedValue(true);
    });

    it('shows a status of logged in', async () => {
      const wrapper = await mountView();
      await flushPromises();
      const label = wrapper.findComponent('[data-testid="auth-status-label"]');
      expect(label.text().trim()).toEqual('Status: Logged In');
    });

    it('labels the auth button "Log Out"', async () => {
      const wrapper = await mountView();
      const button = wrapper.findComponent('[data-testid="auth-button"]');
      expect(button.text().trim()).toEqual('Log Out');
    });

    it('enables the refresh', async () => {
      const wrapper = await mountView();
      const button = wrapper.findComponent('[data-testid="refresh-button"]');
      expect((button.element as HTMLButtonElement).disabled).toBe(false);
    });

    describe('when refresh is available', () => {
      beforeEach(() => {
        const { canRefresh } = useAuthConnect();
        (canRefresh as Mock).mockResolvedValue(true);
      });

      it('enables the refresh', async () => {
        const wrapper = await mountView();
        const button = wrapper.findComponent('[data-testid="refresh-button"]');
        expect((button.element as HTMLButtonElement).disabled).toBe(false);
      });

      describe('refresh clicked', () => {
        it('calls refresh', async () => {
          const wrapper = await mountView();
          const { refresh } = useAuthConnect();
          const button = wrapper.findComponent('[data-testid="refresh-button"]');
          await button.trigger('click');
          expect(refresh).toHaveBeenCalledTimes(1);
        });

        it('queries is authenticated again', async () => {
          const wrapper = await mountView();
          const { isAuthenticated } = useAuthConnect();
          const button = wrapper.findComponent('[data-testid="refresh-button"]');
          await button.trigger('click');
          expect(isAuthenticated).toHaveBeenCalledTimes(2);
        });
      });
    });

    describe('when refresh is not available', () => {
      beforeEach(() => {
        const { canRefresh } = useAuthConnect();
        (canRefresh as Mock).mockResolvedValue(false);
      });

      it('disables the refresh', async () => {
        const wrapper = await mountView();
        const button = wrapper.findComponent('[data-testid="refresh-button"]');
        expect((button.element as HTMLButtonElement).disabled).toBe(true);
      });
    });

    describe('auth button clicked', () => {
      it('performs a logout', async () => {
        const wrapper = await mountView();
        const { logout } = useAuthConnect();
        const button = wrapper.findComponent('[data-testid="auth-button"]');
        await button.trigger('click');
        expect(logout).toHaveBeenCalledTimes(1);
      });

      it('queries is authenticated again', async () => {
        const wrapper = await mountView();
        const { isAuthenticated } = useAuthConnect();
        const button = wrapper.findComponent('[data-testid="auth-button"]');
        await button.trigger('click');
        expect(isAuthenticated).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe('when logged out', () => {
    beforeEach(() => {
      const { isAuthenticated, canRefresh } = useAuthConnect();
      (isAuthenticated as Mock).mockResolvedValue(false);
      (canRefresh as Mock).mockResolvedValue(false);
    });

    it('shows a status of logged out', async () => {
      const wrapper = await mountView();
      const label = wrapper.findComponent('[data-testid="auth-status-label"]');
      expect(label.text().trim()).toEqual('Status: Logged Out');
    });

    it('labels the auth button "Log Out"', async () => {
      const wrapper = await mountView();
      const button = wrapper.findComponent('[data-testid="auth-button"]');
      expect(button.text().trim()).toEqual('Log In');
    });

    it('disables the refresh', async () => {
      const wrapper = await mountView();
      const button = wrapper.findComponent('[data-testid="refresh-button"]');
      expect((button.element as HTMLButtonElement).disabled).toBe(true);
    });

    describe('auth button clicked', () => {
      it('performs a login', async () => {
        const wrapper = await mountView();
        const { login } = useAuthConnect();
        const button = wrapper.findComponent('[data-testid="auth-button"]');
        await button.trigger('click');
        expect(login).toHaveBeenCalledTimes(1);
      });

      it('requeries is authenticated', async () => {
        const wrapper = await mountView();
        const { isAuthenticated } = useAuthConnect();
        const button = wrapper.findComponent('[data-testid="auth-button"]');
        await button.trigger('click');
        expect(isAuthenticated).toHaveBeenCalledTimes(2);
      });
    });
  });
});
