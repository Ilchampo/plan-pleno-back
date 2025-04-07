import type { UserAttributes, UserCreationAttributes } from '@common/interfaces/users';
import type { UserRole } from '@common/types/users';

import { Model, DataTypes } from 'sequelize';

import postgresConnection from '@/db/postgres';

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: string;
  public email!: string;
  public passwordHash!: string;
  public googleId!: string | null;
  public isEmailVerified!: boolean;
  public isBusinessAccount!: boolean;
  public role!: UserRole;
  public passwordResetToken!: string | null;
  public passwordResetExpires!: Date | null;
  public lastLogin!: Date | null;
  public loginAttempts!: number;
  public accountLockedUntil!: Date | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

const initUserModel = (): typeof User => {
  User.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      passwordHash: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      googleId: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
      isEmailVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      isBusinessAccount: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      role: {
        type: DataTypes.ENUM('user', 'business', 'admin', 'superadmin'),
        defaultValue: 'user',
      },
      passwordResetToken: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      passwordResetExpires: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      lastLogin: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      loginAttempts: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      accountLockedUntil: {
        type: DataTypes.DATE,
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
      tableName: 'users',
      modelName: 'User',
    },
  );

  return User;
};

export { User, initUserModel };
