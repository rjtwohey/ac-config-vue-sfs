import InfoPage from '@/views/InfoPage.vue';
import { IonTitle } from '@ionic/vue';
import { flushPromises, mount, VueWrapper } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createRouter, createWebHistory, Router } from 'vue-router';

vi.mock('@/composables/auth-connect');

describe('information page', () => {
  let router: Router;

  const mountView = async (): Promise<VueWrapper<any>> => {
    router = createRouter({
      history: createWebHistory(process.env.BASE_URL),
      routes: [{ path: '/', component: InfoPage }],
    });
    router.push('/');
    await router.isReady();
    const wrapper = mount(InfoPage, {
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
    expect(title.text()).toBe('Information');
  });
});
