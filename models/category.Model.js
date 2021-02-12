const { model, Schema } = require("mongoose");

const catShcema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("Cate", catShcema);
