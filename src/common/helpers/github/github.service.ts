import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Octokit } from '@octokit/core';
import { App } from 'octokit';
import { env } from 'src/common/config/env';
import { GitHubFileContentResponse } from './interface/github.interface';

@Injectable()
export class GithubService {
  private app: App;
  constructor(private readonly httpService: HttpService) {
    this.app = new App({
      appId: env.github.appId,
      privateKey: env.github.appPrivateKey.replace(/\\n/g, '\n'),
    });
  }

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

  async getInstallationInstance(installationId: number) {
    try {
      const installationAccessToken =
        await this.app.getInstallationOctokit(installationId);

      return new Octokit({ auth: installationAccessToken });
    } catch (error) {
      return null;
    }
  }

  async getFileSHA(
    octokit: Octokit,
    owner: string,
    repo: string,
    path: string,
  ): Promise<GitHubFileContentResponse | null> {
    try {
      const response = await octokit.request(
        'GET /repos/{owner}/{repo}/contents/{path}',
        {
          owner,
          repo,
          path,
        },
      );

      return response.data as GitHubFileContentResponse;
    } catch (error) {
      return null;
    }
  }

  async createOrUpdateFile(
    octokit: Octokit,
    owner: string,
    repo: string,
    path: string,
    content: string,
    message: string,
  ) {
    const res = await this.getFileSHA(octokit, owner, repo, path);

    const response = await octokit.request(
      'PUT /repos/{owner}/{repo}/contents/{path}',
      {
        owner,
        repo,
        path,
        message: res ? `Updated ${message}` : `Added ${message}`,
        content,
        sha: res ? res.sha : undefined,
      },
    );
    return response.data;
  }

  async createNewBranchFromDefault(
    octokit: Octokit,
    newBranchName: string,
    baseBranchName: string,
    owner: string,
    repo: string,
  ) {
    const {
      data: {
        commit: { sha },
      },
    } = await octokit.request('GET /repos/{owner}/{repo}/branches/{branch}', {
      owner,
      repo,
      branch: baseBranchName,
    });

    const response = await octokit.request(
      'POST /repos/{owner}/{repo}/git/refs',
      {
        owner,
        repo: repo,
        ref: `refs/heads/${newBranchName}`,
        sha,
      },
    );

    return response.data;
  }

  async createPullRequest(
    octokit: Octokit,
    forkOwner: string,
    repo: string,
    base: string,
    head: string,
    title: string,
    body: string,
  ) {
    const response = await octokit.request('POST /repos/{owner}/{repo}/pulls', {
      owner: forkOwner,
      repo,
      title,
      body,
      head,
      base,
    });

    return response.data;
  }
}
