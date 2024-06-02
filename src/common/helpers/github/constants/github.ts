import { InstallationName } from '../enums/github.enum';

export const installations = [
  {
    id: 50166315,
    owner: InstallationName.IAMNOTSTATIC,
    repo: 'base-migrate-test',
    defaultBranch: 'main',
    category: 'test',
    active: false,
  },
  {
    id: 1,
    owner: InstallationName.ETHEREUM_OPTIMISM,
    repo: 'ethereum-optimism.github.io',
    defaultBranch: 'master',
    category: 'superchain',
    active: false,
  },
  {
    id: 50127144,
    owner: InstallationName.SUPERBRIDGEAPP,
    repo: 'token-lists',
    category: 'superbridge',
    defaultBranch: 'main',
    active: true,
  },
];
