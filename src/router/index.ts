import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import TabsPage from '../views/TabsPage.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/tabs/test-connection',
  },
  {
    path: '/tabs/',
    component: TabsPage,
    children: [
      {
        path: '',
        redirect: '/tabs/test-connection',
      },
      {
        path: 'test-connection',
        component: () => import('@/views/TestConnectionPage.vue'),
      },
      {
        path: 'settings',
        component: () => import('@/views/SettingsPage.vue'),
      },
      {
        path: 'info',
        component: () => import('@/views/InfoPage.vue'),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
