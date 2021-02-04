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
      default: "",
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
    favorit: String,
    resetPasswordLink: {
      data: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = model("User", userShcema);
