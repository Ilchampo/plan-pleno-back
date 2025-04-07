import type {
  UserSavedActivityAttributes,
  UserSavedActivityCreationAttributes,
} from '@common/interfaces/users';

import { Model, DataTypes } from 'sequelize';
import { User } from '@models/postgres/user';

import postgresConnection from '@db/postgres';

class UserSavedActivity
  extends Model<UserSavedActivityAttributes, UserSavedActivityCreationAttributes>
  implements UserSavedActivityAttributes
{
  public id!: string;
  public userId!: string;
  public activityId!: string;

  public readonly createdAt!: Date;

  public readonly user?: User;
}

const initUserSavedActivityModel = (): typeof UserSavedActivity => {
  UserSavedActivity.init(
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
      activityId: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'MongoDB activity ID',
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize: postgresConnection.getSequelize(),
      tableName: 'userSavedActivities',
      modelName: 'UserSavedActivity',
      timestamps: true,
      updatedAt: false,
      indexes: [
        {
          unique: true,
          fields: ['userId', 'activityId'],
          name: 'unique_user_activity',
        },
      ],
    },
  );

  return UserSavedActivity;
};

const setupUserSavedActivityAssociations = (): void => {
  UserSavedActivity.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user',
  });

  User.hasMany(UserSavedActivity, {
    foreignKey: 'userId',
    as: 'savedActivities',
  });
};

export { UserSavedActivity, initUserSavedActivityModel, setupUserSavedActivityAssociations };
