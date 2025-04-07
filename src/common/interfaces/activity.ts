import type { Document, Model, Types } from 'mongoose';
import type { ActivityScheduleType } from '@common/types/activities';
import type { Subcategory } from '@common/interfaces/subcategory';
import type { Category } from '@common/interfaces/category';

export interface Location {
  address: string;
  coordinates: [number, number];
  mapUrl?: string;
}

export interface Schedule {
  type: ActivityScheduleType;
  dates?: Date[];
  recurringSchedule?: {
    daysOfWeek: number[];
    startTime?: string;
    endTime?: string;
  };
}

export interface Activity extends Document {
  name: string;
  description: string;
  images: string[];
  location: Location;
  categoryId: Types.ObjectId | Category;
  subcategoryIds: Types.ObjectId[] | Subcategory[];
  schedule?: Schedule;
  price?: {
    amount: number;
    currency: string;
  };
  duration?: number;
  ageRestriction?: {
    minAge?: number;
    maxAge?: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface ActivityModel extends Model<Activity> {
  findByCategory(categoryId: string): Promise<Activity[]>;
  findBySubcategory(subcategoryId: string): Promise<Activity[]>;
  findNearby(coordinates: [number, number], maxDistance: number): Promise<Activity[]>;
}
