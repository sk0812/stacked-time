const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const DB_NAME = 'stackedtime';
const MONGODB_URI = process.env.MONGODB_URI;

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

const User = mongoose.model('users', UserSchema);

async function main() {
  try {
    await mongoose.connect(MONGODB_URI, {
      dbName: DB_NAME
    });
    console.log('Connected to MongoDB');
    
    // Drop the existing users collection to start fresh
    await mongoose.connection.collection('users').drop().catch(() => {
      console.log('No existing users collection to drop');
    });

    console.log('Creating admin user...');
    const hashedPassword = await bcrypt.hash('Demo123!', 12);
    
    const adminUser = await User.create({
      name: 'Demo User',
      email: 'demo@boilerplate.com',
      password: hashedPassword,
    });

    console.log('Admin account created successfully:', adminUser);

    // Verify the user was created
    const verifyUser = await User.findOne({ email: 'demo@boilerplate.com' });
    console.log('Verification - Found user:', verifyUser);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

main(); 