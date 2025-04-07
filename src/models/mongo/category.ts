import type { Category as ICategory, CategoryModel } from '@common/interfaces/category';

import { Schema, model } from 'mongoose';

const categorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    iconUrl: {
      type: String,
      required: false,
      default: '',
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

categorySchema.virtual('subcategories', {
  ref: 'Subcategory',
  localField: '_id',
  foreignField: 'parentCategories',
});

categorySchema.statics.findByName = function (name: string): Promise<ICategory | null> {
  return this.findOne({ name: new RegExp(`^${name}$`, 'i') }).exec();
};

const Category = model<ICategory, CategoryModel>('Category', categorySchema);

export default Category;
