<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="test-connection" href="/tabs/test-connection">
          <ion-icon :icon="logInOutline" />
          <ion-label>Test Connection</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="settings" href="/tabs/settings">
          <ion-icon :icon="settingsOutline" />
          <ion-label>Settings</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="info" href="/tabs/info">
          <ion-icon :icon="informationCircleOutline" />
          <ion-label>Info</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script setup lang="ts">
import { IonTabBar, IonTabButton, IonTabs, IonLabel, IonIcon, IonPage, IonRouterOutlet } from '@ionic/vue';
import { informationCircleOutline, logInOutline, settingsOutline } from 'ionicons/icons';
</script>
