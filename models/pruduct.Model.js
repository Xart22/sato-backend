const { model, Schema } = require("mongoose");

const productSchema = new Schema(
  {
    product_id: {
      type: String,
      unique: true,
      trim: true,
      required: true,
    },
    name: {
      type: String,
      require: true,
      unique: true,
      trim: true,
    },
    price: {
      type: Number,
      require: true,
      trim: true,
    },
    stock: {
      type: Number,
      require: true,
      trim: true,
    },
    origin: {
      type: String,
      require: true,
      trim: true,
    },
    brand: {
      type: String,
      require: true,
      trim: true,
    },
    description: {
      type: String,
      require: true,
      trim: true,
    },
    image: {
      type: Object,
      require: true,
    },
    sold: {
      type: Number,
      default: 0,
    },
    category: {
      type: [],
      required: true,
    },
    discount: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("Product", productSchema);
