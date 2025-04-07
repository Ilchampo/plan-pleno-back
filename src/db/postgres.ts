import type { PostgresConfig } from '@/common/interfaces/config';

import { Sequelize } from 'sequelize';

import config from '@config/_index';

class PostgresConnection {
  private static instance: PostgresConnection;
  private readonly config: PostgresConfig;
  private sequelize: Sequelize | null = null;

  private constructor() {
    this.config = config.postgres;
  }

  public static getInstance(): PostgresConnection {
    if (!PostgresConnection.instance) {
      PostgresConnection.instance = new PostgresConnection();
    }
    return PostgresConnection.instance;
  }

  public getSequelize(): Sequelize {
    if (!this.sequelize) {
      throw new Error('PostgreSQL not connected. Call connect() first.');
    }
    return this.sequelize;
  }

  public async connect(): Promise<Sequelize> {
    if (this.sequelize) {
      return this.sequelize;
    }

    try {
      this.sequelize = new Sequelize({
        host: this.config.host,
        port: this.config.port,
        database: this.config.database,
        dialect: 'postgres',
        username: this.config.username,
        password: this.config.password,
        logging: false,
        pool: {
          max: 5,
          min: 0,
          acquire: 30000,
          idle: 10000,
        },
      });

      await this.sequelize.authenticate();

      // eslint-disable-next-line no-console
      console.info('Successfully connected to PostgreSQL');

      return this.sequelize;
    } catch (error: unknown) {
      // eslint-disable-next-line no-console
      console.error('Failed to connect to PostgreSQL:', error);

      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    if (!this.sequelize) {
      return;
    }

    try {
      await this.sequelize.close();

      this.sequelize = null;

      // eslint-disable-next-line no-console
      console.info('Disconnected from PostgreSQL');
    } catch (error: unknown) {
      // eslint-disable-next-line no-console
      console.error('Failed to disconnect from PostgreSQL:', error);

      throw error;
    }
  }
}

export default PostgresConnection.getInstance();
