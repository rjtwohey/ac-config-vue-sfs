<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Test Connect</ion-title>
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
            <ion-button fill="outline" data-testid="auth-button" @click="handleAuth()">
              {{ loggedIn ? 'Log Out' : 'Log In' }}
            </ion-button>
            <ion-button :disabled="disableRefresh" data-testid="refresh-button" @click="performRefresh()"
              >Refresh</ion-button
            >
          </div>
        </ion-card-content>
      </ion-card>

      <ion-alert
        :is-open="displayRefreshAlert"
        header="Alert"
        sub-header="Refresh"
        message="The refresh was a success!!"
        :buttons="['OK']"
        @didDismiss="hideRefreshAlert"
      ></ion-alert>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { useAuthConnect } from '@/composables/auth-connect';
import {
  IonAlert,
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
  IonToolbar,
} from '@ionic/vue';
import { ref } from 'vue';

const loggedIn = ref(false);
const errorMessage = ref('');
const displayRefreshAlert = ref(false);
const disableRefresh = ref(true);

const { canRefresh, isAuthenticated, login, logout, refresh } = useAuthConnect();

const checkLoginStatus = async () => {
  loggedIn.value = await isAuthenticated();
  disableRefresh.value = !(await canRefresh());
};

const performRefresh = async () => {
  errorMessage.value = '';
  try {
    await refresh();
    await checkLoginStatus();
    displayRefreshAlert.value = true;
  } catch (err: any) {
    errorMessage.value = err as string;
  }
};

const hideRefreshAlert = () => (displayRefreshAlert.value = false);

const handleAuth = async () => {
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
