import type { UserRole } from '@common/types/users';
import type { Optional } from 'sequelize';

export interface UserAttributes {
  id: string;
  email: string;
  passwordHash: string;
  googleId: string | null;
  isEmailVerified: boolean;
  isBusinessAccount: boolean;
  role: UserRole;
  passwordResetToken: string | null;
  passwordResetExpires: Date | null;
  lastLogin: Date | null;
  loginAttempts: number;
  accountLockedUntil: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserCreationAttributes
  extends Optional<
    UserAttributes,
    | 'id'
    | 'createdAt'
    | 'updatedAt'
    | 'googleId'
    | 'isEmailVerified'
    | 'isBusinessAccount'
    | 'passwordResetToken'
    | 'passwordResetExpires'
    | 'lastLogin'
    | 'loginAttempts'
    | 'accountLockedUntil'
  > {}

export interface UserPreferenceAttributes {
  id: string;
  userId: string;
  categoryId: string;
  weight: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPreferenceCreationAttributes
  extends Optional<UserPreferenceAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export interface UserProfileAttributes {
  id: string;
  userId: string;
  displayName: string;
  bio: string | null;
  ageRange: string | null;
  profilePicture: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfileCreationAttributes
  extends Optional<
    UserProfileAttributes,
    'id' | 'createdAt' | 'updatedAt' | 'bio' | 'ageRange' | 'profilePicture'
  > {}

export interface UserRelationshipAttributes {
  id: string;
  followerId: string;
  followedId: string;
  createdAt: Date;
}

export interface UserRelationshipCreationAttributes
  extends Optional<UserRelationshipAttributes, 'id' | 'createdAt'> {}

export interface UserSavedActivityAttributes {
  id: string;
  userId: string;
  activityId: string;
  createdAt: Date;
}

export interface UserSavedActivityCreationAttributes
  extends Optional<UserSavedActivityAttributes, 'id' | 'createdAt'> {}
