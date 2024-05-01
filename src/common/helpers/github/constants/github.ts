import { InstallationName } from '../enums/github.enum';

export const installations = [
  {
    id: 50166315,
    owner: InstallationName.IAMNOTSTATIC,
    repo: 'base-migrate-test',
    defaultBranch: 'main',
    active: true,
  },
  {
    id: 1,
    owner: InstallationName.ETHEREUM_OPTIMISM,
    repo: 'ethereum-optimism.github.io',
    defaultBranch: 'master',
    active: false,
  },
  {
    id: 2,
    owner: InstallationName.SUPERBRIDGEAPP,
    repo: 'token-lists',
    defaultBranch: 'main',
    active: false,
  },
];
