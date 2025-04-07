import type { Subcategory as ISubcategory, SubcategoryModel } from '@common/interfaces/subcategory';

import { Schema, model } from 'mongoose';

const subcategorySchema = new Schema<ISubcategory>(
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
    parentCategories: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
      },
    ],
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

subcategorySchema.virtual('activities', {
  ref: 'Activity',
  localField: '_id',
  foreignField: 'subcategoryIds',
});

subcategorySchema.statics.findByName = function (name: string): Promise<ISubcategory | null> {
  return this.findOne({ name: new RegExp(`^${name}$`, 'i') }).exec();
};

subcategorySchema.statics.findByCategoryId = function (
  categoryId: string,
): Promise<ISubcategory[]> {
  return this.find({ parentCategories: categoryId }).populate('parentCategories').exec();
};

const Subcategory = model<ISubcategory, SubcategoryModel>('Subcategory', subcategorySchema);

export default Subcategory;
