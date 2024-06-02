import { InstallationName } from '../../../common/helpers/github/enums/github.enum';
import { PrStatus } from '../enums/migration.enum';

export interface Chain {
  id: number;
  name: string;
  token_address: string;
  deployer_address?: string;
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
  repo: string;
  owner: InstallationName;
  url: string;
  status: PrStatus;
  chain: string;
}

export interface Migrate {
  name: string;
  symbol: string;
  decimals: number;
  description: string;
  website: string;
  twitter: string;
  chains: Chain[];
  isSuperbridge?: boolean;
}
