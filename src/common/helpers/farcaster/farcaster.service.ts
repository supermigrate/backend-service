import { Injectable } from '@nestjs/common';
import Launchbox from 'channels-lib';
import { env } from '../../config/env';
import { Channel } from './interfaces/farcaster.interface';

@Injectable()
export class FarcasterService {
  private readonly launchbox: Launchbox;

  constructor() {
    const currentEnv = env.airstack.env as 'prod' | 'dev';
    this.launchbox = new Launchbox(env.airstack.key, currentEnv);
  }

  async getChannelsByAddress(address: string): Promise<Channel[]> {
    try {
      const channels = await this.launchbox.getChannelsByUserAddress(
        address as `0x${string}`,
      );

      return channels.FarcasterChannels.FarcasterChannel as Channel[];
    } catch (error) {
      return [];
    }
  }

  async getChannelCasts(channelUrl: string) {
    try {
      return await this.launchbox.getCasts(channelUrl);
    } catch (error) {
      return [];
    }
  }

  async getNumberOfWeeklyCasts(channelUrl: string) {
    try {
      return await this.launchbox.getNumberOfWeeklyCasts(channelUrl);
    } catch (error) {
      return 0;
    }
  }

  async getSocialCapitalNumber(
    channelName: string,
    chain: string,
    tokenAddress: string,
  ) {
    try {
      return await this.launchbox.getChannelSocialCapital(
        channelName,
        chain,
        tokenAddress as `0x${string}`,
      );
    } catch (error) {
      return 0;
    }
  }
}
