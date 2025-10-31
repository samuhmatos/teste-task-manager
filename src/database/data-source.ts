import 'dotenv/config';
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USERNAME,
  password: String(process.env.DATABASE_PASSWORD),
  database: process.env.DATABASE_DATABASE,
  synchronize: false,
  entities: ['dist/**/*.entity.js'],
  migrations: [process.env.DATABASE_MIGRATIONS],
});
