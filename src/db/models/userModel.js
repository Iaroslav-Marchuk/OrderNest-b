import { Schema, model } from 'mongoose';
import { ROLES } from '../../constants/constants.js';

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    tel: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ROLES,
      default: 'guest',
    },
    telegramChatId: {
      type: String,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export const UsersCollection = model('Users', userSchema);
