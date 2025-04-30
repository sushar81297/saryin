const mongoose = require('mongoose');

const credentialSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    permissions: {
      type: [String],
      enum: ['normal', 'bean', 'price'],
      required: true,
      validate: {
        validator(v) {
          return Array.isArray(v) && v.length > 0;
        },
        message: 'At least one permission is required.',
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Credential', credentialSchema);
