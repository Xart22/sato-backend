const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const token = req.header("x-auth-token");
  try {
    if (!token) {
      return res.status(401).json({
        msg: "No Token, auth denied",
      });
    }

    try {
      const decode = jwt.verify(token, process.env.JWT_TOKEN);
      req.user = decode.user;
      next();
    } catch (error) {
      req.status(401).json({
        msg: "Token is not valid",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};
module.exports = auth;
