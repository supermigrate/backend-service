import { ethers } from 'ethers';

export interface Transaction {
  address: string;
  tokenValue: string;
  ethValue: string;
  fee: string;
  type: 'buy' | 'sell';
  transactionHash: string;
  blockNumber: number;
}

export interface Holder {
  [key: string]: {
    balance: ethers.BigNumber;
    blockNumber: number;
  };
}
