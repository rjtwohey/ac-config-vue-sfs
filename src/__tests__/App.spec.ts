import App from '@/App.vue';
import { SplashScreen } from '@capacitor/splash-screen';
import { shallowMount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@capacitor/splash-screen');

describe('App.vue', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('hides the splash screen', () => {
    shallowMount(App);
    expect(SplashScreen.hide).toHaveBeenCalledTimes(1);
  });
});
