import type {
  UserRelationshipAttributes,
  UserRelationshipCreationAttributes,
} from '@common/interfaces/users';

import { Model, DataTypes } from 'sequelize';
import { User } from '@models/postgres/user';

import postgresConnection from '@db/postgres';

class UserRelationship
  extends Model<UserRelationshipAttributes, UserRelationshipCreationAttributes>
  implements UserRelationshipAttributes
{
  public id!: string;
  public followerId!: string;
  public followedId!: string;

  public readonly createdAt!: Date;

  public readonly follower?: User;
  public readonly followed?: User;
}

const initUserRelationshipModel = (): typeof UserRelationship => {
  UserRelationship.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      followerId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      followedId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize: postgresConnection.getSequelize(),
      tableName: 'userRelationships',
      modelName: 'UserRelationship',
      timestamps: true,
      updatedAt: false,
      indexes: [
        {
          unique: true,
          fields: ['followerId', 'followedId'],
          name: 'unique_follower_followed',
        },
      ],
    },
  );

  return UserRelationship;
};

const setupUserRelationshipAssociations = (): void => {
  UserRelationship.belongsTo(User, {
    foreignKey: 'followerId',
    as: 'follower',
  });

  UserRelationship.belongsTo(User, {
    foreignKey: 'followedId',
    as: 'followed',
  });

  User.belongsToMany(User, {
    through: UserRelationship,
    foreignKey: 'followerId',
    otherKey: 'followedId',
    as: 'following',
  });

  User.belongsToMany(User, {
    through: UserRelationship,
    foreignKey: 'followedId',
    otherKey: 'followerId',
    as: 'followers',
  });
};

export { UserRelationship, initUserRelationshipModel, setupUserRelationshipAssociations };
