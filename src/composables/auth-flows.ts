export interface Flow {
  key: 'implicit' | 'PKCE';
  value: string;
}

const flows: Array<Flow> = [
  { key: 'implicit', value: 'Implicit' },
  { key: 'PKCE', value: 'PKCE' },
];

export const useAuthFlows = () => ({ flows });
