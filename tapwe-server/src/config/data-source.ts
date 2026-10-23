import 'dotenv/config';
import { DataSource } from 'typeorm';
import configuration from './configuration.js';
import { buildTypeOrmOptions } from './typeorm.config.js';

const config = configuration();

export const AppDataSource = new DataSource(buildTypeOrmOptions(config.db, config.isTest));
