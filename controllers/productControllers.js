const Product = require("../models/pruduct.Model");

class APIfeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }
  filtering() {
    const queryObj = { ...this.queryString }; //queryString = req.query
    console.log(queryObj);
    const excludedFields = ["page", "sort", "limit"];
    excludedFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(
      /\b(gte|gt|lt|lte|regex)\b/g,
      (match) => "$" + match
    );

    //    gte = greater than or equal
    //    lte = lesser than or equal
    //    lt = lesser than
    //    gt = greater than
    this.query.find(JSON.parse(queryStr));

    return this;
  }

  sorting() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }

    return this;
  }

  paginating() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 9;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

const productCtrl = {
  getProducts: async (req, res) => {
    try {
      const features = new APIfeatures(Product.find(), req.query)
        .filtering()
        .sorting()
        .paginating();

      const products = await features.query;

      res.json({
        status: "success",
        result: products.length,
        products: products,
      });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },
  creteProducts: async (req, res) => {
    try {
      const {
        product_id,
        name,
        price,
        description,
        category,
        discount,
        image,
      } = req.body;
      if (!image) return res.status(400).json({ message: "No image" });
      const product = await Product.findOne({ product_id });
      if (product)
        return res.status(400).json({ message: "Product Already Exist" });

      const newProduct = new Product({
        product_id,
        name,
        price,
        description,
        category,
        discount,
        image,
      });

      await newProduct.save();
      res.status(200).json({ message: "successful product upload" });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },
  updateProducts: async (req, res) => {
    try {
      const {
        product_id,
        name,
        price,
        description,
        category,
        discount,
        image,
      } = req.body;
      if (!image) return res.status(400).json({ message: "No image" });
      await Product.findOneAndUpdate(
        { _id: req.params.id },
        {
          product_id,
          name,
          price,
          description,
          category,
          discount,
          image,
        }
      );
      res.json({ message: "Success Update Product" });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },
  deleteProducts: async (req, res) => {
    try {
      await Product.findOneAndDelete(req.params.id);
      res.json({ message: "Success Delete Product" });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },
};

module.exports = productCtrl;
