import type { Document, Model } from 'mongoose';

export interface Category extends Document {
  name: string;
  description: string;
  iconUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CategoryModel extends Model<Category> {
  findByName(name: string): Promise<Category | null>;
}
