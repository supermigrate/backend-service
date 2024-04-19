export interface Chain {
  id: number;
  name: string;
  token_address: string;
  token_detail_override?: {
    name?: string;
    symbol?: string;
    decimals?: number;
  };
  transaction_hash?: string;
}

export interface PullRequest {
  url: string;
}

export interface Migrate {
  name: string;
  symbol: string;
  decimals: number;
  description: string;
  website: string;
  twitter: string;
  chains: Chain[];
}
