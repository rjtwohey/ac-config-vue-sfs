<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Information</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <h1>Current Status</h1>
      <dl>
        <dt>Currently Logged In</dt>
        <dd>{{ loggedIn }}</dd>
      </dl>
      <dl>
        <dt>Access Token is Expired</dt>
        <dd>{{ accessTokenExpired }}</dd>
      </dl>
      <dl>
        <dt>Refresh is Available</dt>
        <dd>{{ refreshAvailable }}</dd>
      </dl>
      <dl>
        <dt>Access Token</dt>
        <dd>{{ accessToken }}</dd>
      </dl>

      <h1>Current Configuration</h1>
      <dl>
        <dt>Provider</dt>
        <dd>{{ provider?.value }}</dd>
      </dl>
      <dl>
        <dt>Client ID</dt>
        <dd>{{ config?.clientId }}</dd>
      </dl>
      <dl>
        <dt>Discovery URL</dt>
        <dd>
          <a target="_blank" :href="config?.discoveryUrl">{{ config?.discoveryUrl }}</a>
        </dd>
      </dl>
      <dl>
        <dt>Scope</dt>
        <dd>{{ config?.scope }}</dd>
      </dl>
      <dl>
        <dt>Audience</dt>
        <dd>{{ config?.audience }}</dd>
      </dl>
      <dl v-if="showFlow">
        <dt>Web Auth Flow</dt>
        <dd>{{ flow?.value || 'implicit (using default)' }}</dd>
      </dl>
      <h1>Raw Configuration</h1>
      <pre>{{ configStr }}</pre>

      <h1>Updating the Configuration</h1>
      <h2>General Configuration</h2>
      <p>
        The following configuration items can be customized via the "Settings" page to accomodate the needs of your OIDC
        provider.
      </p>
      <ul>
        <li>authConfig (Provider)</li>
        <li>clientID</li>
        <li>discoveryUrl</li>
        <li>scope</li>
        <li>audience</li>
        <li>webAuthFlow</li>
      </ul>

      <h2>Advanced Configuration</h2>
      <p>
        Some items cannot be configured without changing code in the application itself. This is due either to specific
        redirect schemes needing to be allowed by the mobile applications or due to certain parameters requiring other
        special coding. As such, it makes no sense to allow the user to change them from the app.
      </p>
      <p>
        If you need to change any of the following settings, you will also need to make appropriate changes in the code
        and recompile the app:
      </p>

      <ul>
        <li>redirectUri</li>
        <li>logoutUrl</li>
        <li>uiMode</li>
      </ul>

      <p>
        This app also does not directly allow changing the following settings as they do not affect the actual
        connection:
      </p>
      <ul>
        <li>androidToolbarColor</li>
        <li>iosWebView</li>
        <li>logLevel (this is hardcoded to DEBUG for this app)</li>
        <li>platform (this is set for you automatically depending on how the app is run)</li>
        <li>safariWebViewOptions</li>
        <li>tokenStorageProvider</li>
      </ul>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { useAuthConnect } from '@/composables/auth-connect';
import { Flow } from '@/composables/auth-flows';
import { Provider } from '@/composables/auth-providers';
import { ProviderOptions } from '@ionic-enterprise/auth';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, onIonViewWillEnter, isPlatform } from '@ionic/vue';
import { ref } from 'vue';

const config = ref<ProviderOptions>();
const configStr = ref('');
const flow = ref<Flow>();
const provider = ref<Provider>();
const showFlow = ref(false);

const loggedIn = ref(false);
const accessToken = ref<string | undefined>();
const accessTokenExpired = ref(false);
const refreshAvailable = ref(false);

const { canRefresh, getAccessToken, getConfig, getFlow, getProvider, isAccessTokenExpired, isAuthenticated } =
  useAuthConnect();

onIonViewWillEnter(async () => {
  showFlow.value = isPlatform('hybrid');
  config.value = await getConfig();
  configStr.value = JSON.stringify(config.value, undefined, 2);
  flow.value = await getFlow();
  provider.value = await getProvider();
  loggedIn.value = await isAuthenticated();
  accessToken.value = await getAccessToken();
  accessTokenExpired.value = await isAccessTokenExpired();
  refreshAvailable.value = await canRefresh();
});
</script>
