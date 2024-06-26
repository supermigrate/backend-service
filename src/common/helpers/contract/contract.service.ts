import { Injectable, Logger } from '@nestjs/common';
import { ethers } from 'ethers';
import * as NftAbi from './abis/Nft.json';
import { env } from '../../config/env';
import { Holder, Transaction } from './interfaces/contract.interface';
import { TransactionType } from '../../../modules/launchbox/enums/launchbox.enum';

const BASE_BATCH_SIZE = 3000;
@Injectable()
export class ContractService {
  private httpsProviders: {
    [key: string]: ethers.providers.JsonRpcProvider;
  } = {};

  private readonly Logger = new Logger(ContractService.name);

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
    startBlockNumber: number,
  ): Promise<Holder | undefined> {
    const provider = this.getProvider();

    const ABI = [
      'event Transfer(address indexed from, address indexed to, uint value)',
    ];

    const contract = new ethers.Contract(contractAddress, ABI, provider);

    const batchSize = BASE_BATCH_SIZE;
    const latestBlock = await provider.getBlockNumber();
    const holders: Holder = {};

    for (
      let startBlock = startBlockNumber;
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
            holders[from].balance = holders[from].balance.sub(value);
            holders[from].blockNumber = event.blockNumber;
            if (holders[from].balance.eq(0) || holders[from].balance.lt(0)) {
              holders[from] = {
                balance: ethers.BigNumber.from(0),
                blockNumber: event.blockNumber,
              };
            }
          } else {
            holders[from] = {
              balance: ethers.BigNumber.from(0).sub(value),
              blockNumber: event.blockNumber,
            };
          }

          if (holders[to]) {
            holders[to].balance = holders[to].balance.add(value);
            holders[to].blockNumber = event.blockNumber;
          } else {
            holders[to] = {
              balance: ethers.BigNumber.from(value),
              blockNumber: event.blockNumber,
            };
          }
        });
      } catch (error) {
        this.Logger.error(
          `[ContractService] => GetTokenHolders error occurred`,
          error.stack,
        );
      }

      return holders;
    }
  }

  async getTokenTransactions(
    contractAddress: string,
    startBlockNumber: number,
  ): Promise<Transaction[] | undefined> {
    const provider = this.getProvider();

    const ABI = [
      'event TokenBuy(uint256 ethIn, uint256 tokenOut, uint256 fee, address buyer)',
      'event TokenSell(uint256 tokenIn, uint256 ethOut, uint256 fee, address seller)',
    ];

    const contract = new ethers.Contract(contractAddress, ABI, provider);
    const batchSize = BASE_BATCH_SIZE;
    const latestBlock = await provider.getBlockNumber();
    const transactions: Transaction[] = [];

    for (
      let startBlock = startBlockNumber;
      startBlock <= latestBlock;
      startBlock += batchSize
    ) {
      const endBlock = Math.min(startBlock + batchSize - 1, latestBlock);
      const buyFilter = contract.filters.TokenBuy();
      const sellFilter = contract.filters.TokenSell();

      try {
        const buyEvents = await contract.queryFilter(
          buyFilter,
          startBlock,
          endBlock,
        );
        const sellEvents = await contract.queryFilter(
          sellFilter,
          startBlock,
          endBlock,
        );

        buyEvents.forEach((event) => {
          if (!event.args) {
            return;
          }

          const { ethIn, tokenOut, fee, buyer } = event.args;
          transactions.push({
            address: buyer,
            tokenValue: tokenOut.toString(),
            ethValue: ethIn.toString(),
            fee: fee.toString(),
            type: TransactionType.Buy,
            transactionHash: event.transactionHash,
            blockNumber: event.blockNumber,
          });
        });

        sellEvents.forEach((event) => {
          if (!event.args) {
            return;
          }

          const { tokenIn, ethOut, fee, seller } = event.args;
          transactions.push({
            address: seller,
            tokenValue: tokenIn.toString(),
            ethValue: ethOut.toString(),
            fee: fee.toString(),
            type: TransactionType.Sell,
            transactionHash: event.transactionHash,
            blockNumber: event.blockNumber,
          });
        });
      } catch (error) {
        this.Logger.error(
          `[ContractService] => GetTokenTransactions error occurred`,
          error.stack,
        );
      }
    }

    return transactions;
  }

  async getTokenPriceAndMarketCap(contractAddress: string): Promise<{
    priceEth: string;
    marketCapUsd: string;
  }> {
    const ABI = [
      'function marketCap() external view returns (uint256)',
      'function getTokenPriceinETH() external view returns (uint256 ethAmount)',
    ];

    const contract = new ethers.Contract(
      contractAddress,
      ABI,
      this.getProvider(),
    );

    const marketCap = await contract.marketCap();
    const price = await contract.getTokenPriceinETH();

    return {
      priceEth: ethers.utils.formatEther(price),
      marketCapUsd: ethers.utils.formatEther(marketCap),
    };
  }
}
