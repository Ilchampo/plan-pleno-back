import type {
  UserProfileAttributes,
  UserProfileCreationAttributes,
} from '@common/interfaces/users';

import { Model, DataTypes } from 'sequelize';
import { User } from '@models/postgres/user';

import postgresConnection from '@db/postgres';

class UserProfile
  extends Model<UserProfileAttributes, UserProfileCreationAttributes>
  implements UserProfileAttributes
{
  public id!: string;
  public userId!: string;
  public displayName!: string;
  public bio!: string | null;
  public ageRange!: string | null;
  public profilePicture!: string | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public readonly user?: User;
}

const initUserProfileModel = (): typeof UserProfile => {
  UserProfile.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      displayName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      bio: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      ageRange: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      profilePicture: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize: postgresConnection.getSequelize(),
      tableName: 'userProfiles',
      modelName: 'UserProfile',
    },
  );

  return UserProfile;
};

const setupUserProfileAssociations = (): void => {
  UserProfile.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user',
  });
};

export { UserProfile, initUserProfileModel, setupUserProfileAssociations };
