<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Test Connection</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-card>
        <ion-card-header>
          <ion-card-title> Auth Connect Config </ion-card-title>
          <ion-card-subtitle>The Auth Connect Configuration Tester</ion-card-subtitle>
        </ion-card-header>

        <ion-card-content>
          <ion-label data-testid="auth-status-label">
            Status:
            <span class="status">
              {{ loggedIn ? 'Logged In' : 'Logged Out' }}
            </span>
          </ion-label>
          <div class="error-message">{{ errorMessage }}</div>
          <div class="actions">
            <ion-button fill="outline" data-testid="auth-button" @click="handleAuth">
              {{ loggedIn ? 'Log Out' : 'Log In' }}
            </ion-button>
            <ion-button :disabled="disableRefresh" data-testid="refresh-button" @click="handleRefresh"
              >Refresh</ion-button
            >
          </div>
        </ion-card-content>
      </ion-card>

      <ion-toast
        :is-open="displayRefreshSuccess"
        message="The refresh was successful!!"
        color="success"
        :duration="3000"
        position="middle"
        @didDismiss="() => (displayRefreshSuccess = false)"
      ></ion-toast>
      <ion-toast
        :is-open="displayRefreshFailed"
        message="The refresh failed!!"
        color="danger"
        :duration="3000"
        position="middle"
        @didDismiss="() => (displayRefreshFailed = false)"
      ></ion-toast>
      <ion-toast
        :is-open="displayAuthFailed"
        message="Authentication failed!!"
        color="danger"
        :duration="3000"
        position="middle"
        @didDismiss="() => (displayAuthFailed = false)"
      ></ion-toast>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { useAuthConnect } from '@/composables/auth-connect';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonLabel,
  IonPage,
  IonTitle,
  IonToast,
  IonToolbar,
} from '@ionic/vue';
import { ref } from 'vue';

const loggedIn = ref(false);
const errorMessage = ref('');
const displayRefreshSuccess = ref(false);
const displayRefreshFailed = ref(false);
const displayAuthFailed = ref(false);
const disableRefresh = ref(true);

const { canRefresh, isAuthenticated, login, logout, refresh } = useAuthConnect();

const checkLoginStatus = async () => {
  loggedIn.value = await isAuthenticated();
  disableRefresh.value = !(await canRefresh());
};

const handleRefresh = async (): Promise<void> => {
  try {
    await refresh();
    await checkLoginStatus();
    displayRefreshSuccess.value = true;
  } catch (err: any) {
    displayRefreshFailed.value = true;
  }
};

const handleAuth = async (): Promise<void> => {
  try {
    await performAuth();
  } catch (err: any) {
    displayAuthFailed.value = true;
  }
};

const performAuth = async () => {
  if (loggedIn.value) {
    await logout();
  } else {
    await login();
  }
  await checkLoginStatus();
};

checkLoginStatus();
</script>

<style scoped>
@media (min-width: 0px) {
  ion-card {
    margin-top: 20%;
    margin-left: 5%;
    margin-right: 5%;
  }
}

@media (min-width: 576px) {
  ion-card {
    margin-top: 15%;
    margin-left: 10%;
    margin-right: 10%;
  }
}

@media (min-width: 768px) {
  ion-card {
    margin-top: 15%;
    margin-left: 20%;
    margin-right: 20%;
  }
}

@media (min-width: 992px) {
  ion-card {
    margin-top: 10%;
    margin-left: 25%;
    margin-right: 25%;
  }
}

@media (min-width: 1200px) {
  ion-card {
    margin-top: 10%;
    margin-left: 30%;
    margin-right: 30%;
  }
}

.actions {
  display: flex;
  justify-content: center;
}

.actions ion-button {
  flex-grow: 1;
}
</style>
