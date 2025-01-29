import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  collection: 'users'
});

// Delete the model if it exists to prevent OverwriteModelError
if (mongoose.models.users) {
  delete mongoose.models.users;
}

const UserModel = mongoose.model('users', UserSchema);
export default UserModel; 