import InfoPage from '@/views/InfoPage.vue';
import { flushPromises, mount, VueWrapper } from '@vue/test-utils';
import { createRouter, createWebHistory, Router } from 'vue-router';
// import { useAuthConnect } from '@/composables/auth-connect';
import { IonTitle } from '@ionic/vue';

jest.mock('@/composables/auth-connect');

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
    jest.resetAllMocks();
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
