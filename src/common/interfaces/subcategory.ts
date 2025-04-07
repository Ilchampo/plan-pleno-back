import type { Document, Types, Model } from 'mongoose';
import type { Category } from '@common/interfaces/category';

export interface Subcategory extends Document {
  name: string;
  description: string;
  iconUrl: string;
  parentCategories: Types.ObjectId[] | Category[];
  createdAt: Date;
  updatedAt: Date;
}

export interface SubcategoryModel extends Model<Subcategory> {
  findByName(name: string): Promise<Subcategory | null>;
  findByCategoryId(categoryId: string): Promise<Subcategory[]>;
}
