namespace NodeJS {
  interface ProcessEnv {
    APP_PORT: string;
    NODE_ENV: 'development' | 'production';

    DATABASE_HOST: string;
    DATABASE_USERNAME: string;
    DATABASE_PASSWORD: string;
    DATABASE_DATABASE: string;
    DATABASE_PORT: string;
    DATABASE_LOGGING?: 'true' | 'false';
    DATABASE_MIGRATIONS: string;
  }
}
