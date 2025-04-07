import type { Review as IReview, ReviewModel } from '@common/interfaces/review';

import { Types, Schema, model } from 'mongoose';

const reviewSchema = new Schema<IReview>(
  {
    activityId: {
      type: Schema.Types.ObjectId,
      ref: 'Activity',
      required: true,
      index: true,
    },
    userId: {
      type: String,
      required: true,
      index: true,
    },
    rating: {
      type: Boolean,
      required: true,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_, ret) => {
        delete ret.__v;
        return ret;
      },
    },
  },
);

reviewSchema.statics.findByActivityId = function (activityId: string): Promise<IReview[]> {
  return this.find({ activityId }).sort({ createdAt: -1 }).exec();
};

reviewSchema.statics.findByUserId = function (userId: string): Promise<IReview[]> {
  return this.find({ userId }).populate('activityId').sort({ createdAt: -1 }).exec();
};

reviewSchema.statics.getReviewStats = async function (
  activityId: string,
): Promise<{ thumbsUp: number; thumbsDown: number }> {
  const stats = await this.aggregate([
    { $match: { activityId: new Types.ObjectId(activityId) } },
    {
      $group: {
        _id: '$rating',
        count: { $sum: 1 },
      },
    },
  ]).exec();

  const thumbsUp = stats.find(stat => stat._id === true)?.count || 0;
  const thumbsDown = stats.find(stat => stat._id === false)?.count || 0;

  return { thumbsUp, thumbsDown };
};

const Review = model<IReview, ReviewModel>('Review', reviewSchema);

export default Review;
