import App from '@/App.vue';
import { SplashScreen } from '@capacitor/splash-screen';
import { shallowMount } from '@vue/test-utils';

describe('App.vue', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('hides the splash screen', () => {
    shallowMount(App);
    expect(SplashScreen.hide).toHaveBeenCalledTimes(1);
  });
});
