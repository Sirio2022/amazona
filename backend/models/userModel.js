import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true, // trim white spaces
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true, // trim white spaces
    },
    password: {
      type: String,
      required: true,
      trim: true, // trim white spaces
    },
    isAdmin: {
      type: Boolean,
      default: false,
      required: true,
    },
    isSeller: {
      type: Boolean,
      default: false,
      required: true,
    },
    seller: {
      name: String,
      logo: String,
      description: String,
      rating: {
        type: Number,
        default: 0,
        required: true,
      },
      numReviews: {
        type: Number,
        default: 0,
        required: true,
      },
    },
    isConfirmed: {
      type: Boolean,
      default: false,
    },
    token: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Hashing password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next(); // if password is not modified, do nothing
  } // if password is not modified, do nothing
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt); // this refers to the user object
});

// Comparing passwords
userSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
