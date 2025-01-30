import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

// Create a compound index to ensure unique categories per user
CategorySchema.index({ userId: 1, name: 1 }, { unique: true });

// Delete the model if it exists to prevent OverwriteModelError
if (mongoose.models.Category) {
  delete mongoose.models.Category;
}

const CategoryModel = mongoose.model('Category', CategorySchema);
export default CategoryModel; 