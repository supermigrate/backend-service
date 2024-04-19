import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Octokit } from '@octokit/core';
import { env } from 'src/common/config/env';

@Injectable()
export class GithubService {
  constructor(private readonly httpService: HttpService) {}

  async getUserByAuthCode(code: string) {
    try {
      const response = await this.httpService.axiosRef.post(
        `${env.github.url}/login/oauth/access_token`,
        {
          client_id: env.github.clientId,
          client_secret: env.github.clientSecret,
          code,
        },
        {
          headers: {
            Accept: 'application/json',
          },
        },
      );

      const octokit = new Octokit({ auth: response.data.access_token });
      const user = await octokit.request('GET /user');

      return {
        status: true,
        data: user.data,
      };
    } catch (error) {
      return {
        status: false,
        message: error.message,
      };
    }
  }
}
