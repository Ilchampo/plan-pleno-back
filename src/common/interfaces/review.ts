import type { Document, Types, Model } from 'mongoose';
import type { Activity } from '@common/interfaces/activity';

export interface Review extends Document {
  activityId: Types.ObjectId | Activity;
  userId: string;
  rating: boolean;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReviewModel extends Model<Review> {
  findByActivityId(activityId: string): Promise<Review[]>;
  findByUserId(userId: string): Promise<Review[]>;
  getReviewStats(activityId: string): Promise<{ thumbsUp: number; thumbsDown: number }>;
}
