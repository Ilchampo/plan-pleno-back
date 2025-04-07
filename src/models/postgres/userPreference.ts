import type {
  UserPreferenceAttributes,
  UserPreferenceCreationAttributes,
} from '@common/interfaces/users';

import { Model, DataTypes } from 'sequelize';
import { User } from '@models/postgres/user';

import postgresConnection from '@db/postgres';

class UserPreference
  extends Model<UserPreferenceAttributes, UserPreferenceCreationAttributes>
  implements UserPreferenceAttributes
{
  public id!: string;
  public userId!: string;
  public categoryId!: string;
  public weight!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public readonly user?: User;
}

const initUserPreferenceModel = (): typeof UserPreference => {
  UserPreference.init(
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
      categoryId: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'MongoDB category ID',
      },
      weight: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 1.0,
        validate: {
          min: 0,
          max: 10,
        },
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
      tableName: 'userPreferences',
      modelName: 'UserPreference',
      indexes: [
        {
          unique: true,
          fields: ['userId', 'categoryId'],
          name: 'unique_user_category',
        },
      ],
    },
  );

  return UserPreference;
};

const setupUserPreferenceAssociations = (): void => {
  UserPreference.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user',
  });

  User.hasMany(UserPreference, {
    foreignKey: 'userId',
    as: 'preferences',
  });
};

export { UserPreference, initUserPreferenceModel, setupUserPreferenceAssociations };
