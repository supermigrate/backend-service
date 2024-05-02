module.exports = {
  apps: [
    {
      name: 'backend-service',
      script: 'yarn',
      args: 'start:prod',
      watch: false,
      merge_logs: true,
      cwd: '/var/www/backend-service',
    },
  ],
};
