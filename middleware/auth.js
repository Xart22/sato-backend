const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  try {
    const token = req.header("x-auth-token");
    if (!token)
      return res.status(401).json({ message: "No Token, auth denied" });
    jwt.verify(token, process.env.JWT_TOKEN, (err, result) => {
      if (err)
        return res.status(400).json({ message: "Invalid Authentication", err });
      req.user = result.user;
      next();
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};
module.exports = auth;
