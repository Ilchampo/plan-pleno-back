import type {
  Location,
  Schedule,
  ActivityModel,
  Activity as IActivity,
} from '@common/interfaces/activity';

import { Schema, model } from 'mongoose';

const locationSchema = new Schema<Location>(
  {
    address: {
      type: String,
      required: true,
      trim: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
    mapUrl: {
      type: String,
      required: false,
    },
  },
  { _id: false },
);

const scheduleSchema = new Schema<Schedule>(
  {
    type: {
      type: String,
      enum: ['one-time', 'recurring'],
      required: true,
    },
    dates: {
      type: [Date],
      required: false,
    },
    recurringSchedule: {
      type: {
        daysOfWeek: {
          type: [Number],
          required: true,
          validate: {
            validator: (value: number[]) => value.every(day => day >= 0 && day <= 6),
            message: 'Days of week must be between 0 and 6',
          },
        },
        startTime: {
          type: String,
          required: false,
          validate: {
            validator: (value: string) => /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(value),
            message: 'Start time must be in HH:MM format',
          },
        },
        endTime: {
          type: String,
          required: false,
          validate: {
            validator: (value: string) => /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(value),
            message: 'End time must be in HH:MM format',
          },
        },
      },
      required: false,
    },
  },
  { _id: false },
);

const priceSchema = new Schema(
  {
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      required: true,
      default: 'USD',
      enum: ['USD', 'EUR', 'GBP'],
    },
  },
  { _id: false },
);

const ageRestrictionSchema = new Schema(
  {
    minAge: {
      type: Number,
      required: false,
      min: 0,
    },
    maxAge: {
      type: Number,
      required: false,
      min: 0,
    },
  },
  { _id: false },
);

const activitySchema = new Schema<IActivity>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    images: {
      type: [String],
      required: false,
      default: [],
    },
    location: {
      type: locationSchema,
      required: true,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    subcategoryIds: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Subcategory',
        required: true,
      },
    ],
    schedule: {
      type: scheduleSchema,
      required: false,
    },
    price: {
      type: priceSchema,
      required: false,
    },
    duration: {
      type: Number,
      required: false,
      min: 1,
    },
    ageRestriction: {
      type: ageRestrictionSchema,
      required: false,
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

activitySchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'activityId',
});

activitySchema.statics.findByCategory = function (categoryId: string): Promise<IActivity[]> {
  return this.find({ categoryId }).populate(['categoryId', 'subcategoryIds']).exec();
};

activitySchema.statics.findBySubcategory = function (subcategoryId: string): Promise<IActivity[]> {
  return this.find({ subcategoryIds: subcategoryId })
    .populate(['categoryId', 'subcategoryIds'])
    .exec();
};

activitySchema.statics.findNearby = function (
  coordinates: [number, number],
  maxDistance: number = 10000,
): Promise<IActivity[]> {
  return this.find({
    'location.coordinates': {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates,
        },
        $maxDistance: maxDistance,
      },
    },
  }).exec();
};

const Activity = model<IActivity, ActivityModel>('Activity', activitySchema);

export default Activity;
