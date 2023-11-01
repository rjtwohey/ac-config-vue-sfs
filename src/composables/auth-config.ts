import { ProviderOptions } from '@ionic-enterprise/auth';

const auth0Config: ProviderOptions = {
  // audience value is required for auth0's config. If it doesn't exist, the jwt payload will be empty
  audience: 'https://io.ionic.demo.ac',
  clientId: 'yLasZNUGkZ19DGEjTmAITBfGXzqbvd00',
  discoveryUrl: 'https://dev-2uspt-sz.us.auth0.com/.well-known/openid-configuration',
  redirectUri: 'msauth://auth-action-complete',
  logoutUrl: 'msauth://auth-action-complete',
  scope: 'openid email picture profile offline_access',
};

const awsConfig: ProviderOptions = {
  clientId: '64p9c53l5thd5dikra675suvq9',
  discoveryUrl: 'https://cognito-idp.us-east-2.amazonaws.com/us-east-2_YU8VQe29z/.well-known/openid-configuration',
  redirectUri: 'msauth://auth-action-complete',
  logoutUrl: 'msauth://auth-action-complete',
  scope: 'openid email profile',
  audience: '',
};

const azureConfig: ProviderOptions = {
  clientId: 'a6dbcaa1-c691-4cad-8bbe-ec9543475ec2',
  scope:
    'openid offline_access email profile https://imenuapss.onmicrosoft.com/a6dbcaa1-c691-4cad-8bbe-ec9543475ec2/user_impersonation',
  discoveryUrl:
    'https://imenuapss.b2clogin.com/imenuapss.onmicrosoft.com/B2C_1_SignUpSignIn/v2.0/.well-known/openid-configuration',
  redirectUri: 'http://localhost:8100/',
  logoutUrl: 'https://imenuapss.b2clogin.com/imenuapss.onmicrosoft.com/B2C_1_SignUpSignIn/oauth2/v2.0/logout',
  audience: '',
};

const oktaConfig: ProviderOptions = {
  clientId: '0oaur4c907I5uMr4I0h7',
  discoveryUrl: 'https://dev-622807.oktapreview.com/.well-known/openid-configuration',
  redirectUri: 'msauth://auth-action-complete',
  logoutUrl: 'msauth://auth-action-complete',
  scope: 'openid email profile offline_access',
  audience: '',
};

const webConfig = {
  redirectUri: 'http://localhost:8100/auth-action-complete',
  logoutUrl: 'http://localhost:8100/auth-action-complete',
};

const mobileConfig = {
  redirectUri: `${import.meta.env.VITE_AUTH_URL_SCHEME}://auth-action-complete`,
  logoutUrl: `${import.meta.env.VITE_AUTH_URL_SCHEME}://auth-action-complete`,
};

export const useAuthConfig = () => ({
  auth0Config,
  awsConfig,
  azureConfig,
  oktaConfig,
  webConfig,
  mobileConfig,
});
