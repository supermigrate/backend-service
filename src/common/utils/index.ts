export const getEnvPath = () => {
  const env: string | undefined = process.env.NODE_ENV;
  const envPath = `${process.cwd()}/.env${env ? '.' + env : '.local'}`;

  return envPath;
};

export const generateCode = (length = 8) => {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let code = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters[randomIndex];
  }

  return code;
};
