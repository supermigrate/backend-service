import { PrStatus } from '../enums/migration.enum';

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
  id: number;
  installation_id: number;
  url: string;
  status: PrStatus;
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
