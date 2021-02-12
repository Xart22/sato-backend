const { model, Schema } = require("mongoose");

const userShcema = new Schema(
  {
    email: {
      type: String,
      trim: true,
      unique: true,
      required: true,
      lowercase: true,
    },
    passwordHash: String,
    username: {
      type: String,
      trim: true,
      required: true,
    },
    phone: String,
    alamat: String,
    avatar: String,
    role: {
      type: Number,
      default: 0,
    },
    history: {
      type: Array,
      default: [],
    },
    favorit: {
      type: Array,
      default: [],
    },
    resetPasswordLink: {
      data: String,
      default: "",
    },
    cart: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = model("User", userShcema);
