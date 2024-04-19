import { InstallationName } from '../enums/github.enum';

export interface GitHubFileContentResponse {
  sha: string;
  content: string;
}

export interface Installation {
  id: number;
  owner: InstallationName;
  repo: string;
  defaultBranch: string;
}

export interface EthereumOptimism {
  name: string;
  symbol: string;
  decimals: number;
  description?: string;
  website?: string;
  twitter?: string;
  tokens: {
    [chainName: string]: {
      address: string;
      overrides?: {
        name?: string;
        symbol?: string;
        decimals?: number;
      };
    };
  }[];
}

export interface SuperBridgeApp {
  name: string;
  symbol: string;
  decimals: number;
  logoURI: string;
  opTokenId: string;
  addresses: {
    [chainId: number]: {
      address: string;
    };
  }[];
}
