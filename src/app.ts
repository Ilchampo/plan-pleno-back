import type { Express } from 'express';

import express from 'express';

import postgresConnection from '@db/postgres';
import mongoConnection from '@db/mongo';
import config from '@config/_index';

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', async (req, res) => {
  let mongoStatus = 'disconnected';

  try {
    const mongoose = mongoConnection.getMongoose();
    mongoStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  } catch {
    mongoStatus = 'not_initialized';
  }

  let postgresStatus = 'disconnected';

  try {
    const sequelize = postgresConnection.getSequelize();

    await sequelize.authenticate({ logging: false });

    postgresStatus = 'connected';
  } catch (error) {
    if (error instanceof Error && error.message.includes('Call connect() first')) {
      postgresStatus = 'not_initialized';
    }
  }

  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: config.server.nodeEnv,
    databases: {
      mongodb: mongoStatus,
      postgres: postgresStatus,
    },
  });
});

app.use(config.server.apiPrefix, (req, res) => {
  res.status(200).json({
    message: 'Plan Pleno API',
  });
});

app.use((req, res) => {
  res.status(404).json({
    message: 'Not Found',
    path: req.originalUrl,
  });
});

export default app;
