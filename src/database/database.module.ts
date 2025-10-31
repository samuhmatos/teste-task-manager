import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { entities } from './database.config';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory() {
        return {
          name: 'default',
          type: 'postgres',
          host: process.env.DATABASE_HOST,
          username: process.env.DATABASE_USERNAME,
          password: process.env.DATABASE_PASSWORD,
          database: process.env.DATABASE_DATABASE,
          port: parseInt(process.env.DATABASE_PORT),
          synchronize: false,
          dropSchema: false,
          migrationsRun: false,
          keepConnectionAlive: true,
          logging: process.env.DATABASE_LOGGING === 'true',
          logger: process.env.DATABASE_LOGGING === 'true' ? 'file' : undefined,
          applicationName: 'task-manager',
          entities,
        };
      },
    }),
  ],
})
export class DatabaseModule {}
