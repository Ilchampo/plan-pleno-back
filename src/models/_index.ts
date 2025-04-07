import type { Sequelize } from 'sequelize';

import { User, initUserModel } from '@models/postgres/user';
import {
  UserProfile,
  initUserProfileModel,
  setupUserProfileAssociations,
} from '@models/postgres/userProfile';
import {
  UserRelationship,
  initUserRelationshipModel,
  setupUserRelationshipAssociations,
} from '@models/postgres/userRelationship';
import {
  UserSavedActivity,
  initUserSavedActivityModel,
  setupUserSavedActivityAssociations,
} from '@models/postgres/userSaveActivity';
import {
  UserPreference,
  initUserPreferenceModel,
  setupUserPreferenceAssociations,
} from '@models/postgres/userPreference';

import Category from '@models/mongo/category';
import Subcategory from '@models/mongo/subcategory';
import Activity from '@models/mongo/activity';
import Review from '@models/mongo/review';

export const initPostgresModels = (sequelize: Sequelize): void => {
  initUserModel();
  initUserProfileModel();
  initUserRelationshipModel();
  initUserSavedActivityModel();
  initUserPreferenceModel();

  setupUserProfileAssociations();
  setupUserRelationshipAssociations();
  setupUserSavedActivityAssociations();
  setupUserPreferenceAssociations();

  if (process.env.NODE_ENV === 'development') {
    sequelize.sync({ alter: true }).catch(error => {
      // eslint-disable-next-line no-console
      console.error('Error syncing PostgreSQL models:', error);
    });
  }
};

export { Category, Subcategory, Activity, Review };

export { User, UserProfile, UserRelationship, UserSavedActivity, UserPreference };

export const initModels = async (sequelize: Sequelize): Promise<void> => {
  try {
    initPostgresModels(sequelize);

    await Promise.all([
      Category.syncIndexes(),
      Subcategory.syncIndexes(),
      Activity.syncIndexes(),
      Review.syncIndexes(),
    ]);

    // eslint-disable-next-line no-console
    console.info('Models initialized successfully');
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error initializing models:', error);
    throw error;
  }
};
