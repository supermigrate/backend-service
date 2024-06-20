import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import * as NftAbi from './abis/Nft.json';
import { env } from '../../config/env';

@Injectable()
export class ContractService {
  private httpsProviders: {
    [key: string]: ethers.providers.JsonRpcProvider;
  } = {};

  getProvider(): ethers.providers.JsonRpcProvider {
    if (!this.httpsProviders[env.blockchain.rpcUrl]) {
      this.httpsProviders[env.blockchain.rpcUrl] =
        new ethers.providers.JsonRpcProvider(env.blockchain.rpcUrl);
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

  async getTokenHolders(
    contractAddress: string,
  ): Promise<{ [address: string]: ethers.BigNumber } | undefined> {
    const provider = this.getProvider();

    const ABI = [
      'event Transfer(address indexed from, address indexed to, uint value)',
    ];

    const contract = new ethers.Contract(contractAddress, ABI, provider);

    const batchSize = 10000;
    const latestBlock = await provider.getBlockNumber();
    const holders: {
      [address: string]: ethers.BigNumber;
    } = {};

    for (
      let startBlock = 0;
      startBlock <= latestBlock;
      startBlock += batchSize
    ) {
      const endBlock = Math.min(startBlock + batchSize - 1, latestBlock);
      const filter = contract.filters.Transfer();
      try {
        const events = await contract.queryFilter(filter, startBlock, endBlock);

        events.forEach((event) => {
          if (!event.args) {
            return;
          }

          const { from, to, value } = event.args;

          if (holders[from]) {
            holders[from] = holders[from].sub(value);
            if (holders[from].eq(0)) {
              delete holders[from];
            }
          } else {
            holders[from] = ethers.BigNumber.from(0).sub(value);
          }
          if (holders[to]) {
            holders[to] = holders[to].add(value);
          } else {
            holders[to] = value;
          }
        });

        return holders;
      } catch (error) {
        return holders;
      }
    }
  }
}
