import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import * as NftAbi from './abis/Nft.json';
import { env } from '../../config/env';

@Injectable()
export class ContractService {
  private httpsProviders: {
    [key: string]: ethers.JsonRpcProvider;
  } = {};

  getProvider(): ethers.JsonRpcProvider {
    if (!this.httpsProviders[env.blockchain.rpcUrl]) {
      this.httpsProviders[env.blockchain.rpcUrl] = new ethers.JsonRpcProvider(
        env.blockchain.rpcUrl,
      );
    }

    return this.httpsProviders[env.blockchain.rpcUrl];
  }

  getContract(): ethers.Contract {
    return new ethers.Contract(
      env.contract.nftAddress,
      NftAbi,
      this.getProvider(),
    );
  }

  async getBalance(address: string): Promise<number> {
    const contract = this.getContract();

    const nextTokenId = await contract.nextTokenId();

    for (let i = 1; i < nextTokenId; i++) {
      const balance = await contract.balanceOf(address, i);
      if (balance > 0) {
        return i;
      }
    }

    return 0;
  }
}
