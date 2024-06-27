import { Injectable, Logger } from '@nestjs/common';
import { chromium } from 'playwright';
import { env } from '../../config/env';

@Injectable()
export class SharedService {
  private readonly Logger = new Logger(SharedService.name);

  async getEthPriceInUsd(): Promise<number> {
    try {
      const browser = await chromium.launch({ headless: true });
      const page = await browser.newPage();
      await page.goto(env.blockchainPrice.url, {
        waitUntil: 'domcontentloaded',
      });

      const ethPrice = await page.$eval('.sc-bb87d037-10', (el) =>
        el.textContent ? el.textContent.trim() : '',
      );
      const ethPriceInNumber = parseFloat(ethPrice.replace(/[^0-9.-]+/g, ''));

      await browser.close();

      return ethPriceInNumber;
    } catch (error) {
      this.Logger.error(
        `SharedService.getEthPriceInUsd: Error while fetching ETH price`,
        error,
      );

      return 0;
    }
  }
}
