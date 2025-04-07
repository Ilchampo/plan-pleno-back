import { initModels } from '@/models/_index';

import postgresConnection from '@/db/postgres';
import mongoConnection from '@/db/mongo';
import config from '@config/_index';
import app from '@/app';

const initializeDatabases = async (): Promise<void> => {
  try {
    await mongoConnection.connect();

    const sequelize = await postgresConnection.connect();

    await initModels(sequelize);

    // eslint-disable-next-line no-console
    console.info('Database initialization complete');
  } catch (error: unknown) {
    // eslint-disable-next-line no-console
    console.error('Failed to initialize databases:', error);

    process.exit(1);
  }
};

const startServer = async (): Promise<void> => {
  const { port } = config.server;

  try {
    await initializeDatabases();

    app.listen(port, () => {
      // eslint-disable-next-line no-console
      console.info(`Server running on port ${port} in ${config.server.nodeEnv} mode`);

      // eslint-disable-next-line no-console
      console.info(`Health check: http://localhost:${port}/health`);

      // eslint-disable-next-line no-console
      console.info(`API Endpoint: http://localhost:${port}${config.server.apiPrefix}`);
    });

    process.on('unhandledRejection', (err: unknown) => {
      // eslint-disable-next-line no-console
      console.error('Unhandled Promise Rejection:', err);

      if (config.server.nodeEnv === 'production') {
        process.exit(1);
      }
    });

    process.on('SIGINT', async () => {
      try {
        await mongoConnection.disconnect();
        await postgresConnection.disconnect();

        // eslint-disable-next-line no-console
        console.info('Server shutting down gracefully');

        process.exit(0);
      } catch (error: unknown) {
        // eslint-disable-next-line no-console
        console.error('Error during graceful shutdown:', error);

        process.exit(1);
      }
    });
  } catch (error: unknown) {
    // eslint-disable-next-line no-console
    console.error('Failed to start server:', error);

    process.exit(1);
  }
};

startServer();
