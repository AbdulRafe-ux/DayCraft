const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: {
      type: String,
      required: true,
      unique: true, // creates a unique index
      lowercase: true,
      trim: true,
      maxlength: 254,
    },
    // Only the bcrypt hash is stored. "select: false" keeps it out of queries by default.
    passwordHash: { type: String, required: true, select: false },
  },
  { timestamps: true }
);

// Never leak internal fields when a user is converted to JSON.
userSchema.set('toJSON', {
  transform: (_doc, ret) => ({
    id: ret._id.toString(),
    name: ret.name,
    email: ret.email,
    createdAt: ret.createdAt,
  }),
});

module.exports = mongoose.model('User', userSchema);
