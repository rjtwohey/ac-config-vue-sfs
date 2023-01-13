export interface Provider {
  key: 'auth0' | 'azure' | 'cognito' | 'okta' | 'onelogin';
  value: string;
}

const providers: Array<Provider> = [
  { key: 'auth0', value: 'Auth0' },
  { key: 'azure', value: 'Azure B2C' },
  { key: 'cognito', value: 'Cognito (AWS)' },
  { key: 'okta', value: 'Okta' },
  { key: 'onelogin', value: 'OneLogin' },
];

export const useAuthProviders = () => ({ providers });
