const Cate = require("../models/category.Model");

const categoryCtrl = {
  getCategory: async (req, res) => {
    try {
      const category = await Cate.find();
      res.json(category);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  createCategory: async (req, res) => {
    try {
      const { name } = req.body;
      const category = await Cate.findOne({ name });
      if (category) return req.status(400).json({ message: "Category found" });
      const newCategory = new Cate({ name });
      await newCategory.save();
      res.json("Success adding category");
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  delete: async (req, res) => {
    try {
      await Cate.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: "Success delete" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
};

module.exports = categoryCtrl;
