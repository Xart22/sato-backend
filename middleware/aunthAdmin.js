const User = require("../models/userModel");

const authAdmin = async (req, res, next) => {
  try {
    const user = await User.findOne({
      _id: req.user._id,
    });
    if (user.role === 0)
      return res.status(400).json({ msg: "you are not admin" });
    next();
  } catch (error) {
    return res.status(500).json({ msg: error });
  }
};

module.exports = authAdmin;
