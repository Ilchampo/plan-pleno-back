import type { MongoDbConfig } from '@common/interfaces/config';

import mongoose from 'mongoose';
import config from '@config/_index';

class MongoDBConnection {
  private static instance: MongoDBConnection;
  private readonly config: MongoDbConfig;
  private isConnected = false;

  private constructor() {
    this.config = config.mongodb;
  }

  public static getInstance(): MongoDBConnection {
    if (!MongoDBConnection.instance) {
      MongoDBConnection.instance = new MongoDBConnection();
    }
    return MongoDBConnection.instance;
  }

  public getMongoose(): typeof mongoose {
    if (!this.isConnected) {
      throw new Error('MongoDB not connected. Call connect() first.');
    }
    return mongoose;
  }

  public async connect(): Promise<typeof mongoose> {
    if (this.isConnected) {
      return mongoose;
    }

    try {
      // eslint-disable-next-line no-console
      console.info(`Attempting to connect to MongoDB`);

      mongoose.set('strictQuery', true);

      await mongoose.connect(this.config.uri, {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });

      this.isConnected = true;

      // eslint-disable-next-line no-console
      console.info('Successfully connected to MongoDB');

      mongoose.connection.on('error', (error: Error) => {
        // eslint-disable-next-line no-console
        console.error('MongoDB connection error:', error);

        this.isConnected = false;
      });

      mongoose.connection.on('disconnected', () => {
        // eslint-disable-next-line no-console
        console.info('MongoDB disconnected');

        this.isConnected = false;
      });

      return mongoose;
    } catch (error: unknown) {
      // eslint-disable-next-line no-console
      console.error('Failed to connect to MongoDB:');

      if (error instanceof Error) {
        // eslint-disable-next-line no-console
        console.error(`- Error name: ${error.name}`);

        // eslint-disable-next-line no-console
        console.error(`- Error message: ${error.message}`);

        // eslint-disable-next-line no-console
        console.error(`- Check your MongoDB Atlas IP whitelist or network connectivity`);
      } else {
        // eslint-disable-next-line no-console
        console.error(error);
      }
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    if (!this.isConnected) {
      return;
    }

    try {
      await mongoose.disconnect();
      this.isConnected = false;

      // eslint-disable-next-line no-console
      console.info('Disconnected from MongoDB');
    } catch (error: unknown) {
      // eslint-disable-next-line no-console
      console.error('Failed to disconnect from MongoDB:', error);

      throw error;
    }
  }
}

export default MongoDBConnection.getInstance();
