const bcrypt = require("bcrypt");
const router = require("express").Router();
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const { GoogleAuth } = require("google-auth-library");
const fetch = require("node-fetch");
const nodemailer = require("nodemailer");
const gravatar = require("gravatar");
const auth = require("../middleware/auth");
const userContr = require("../controllers/userControllers");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  auth: {
    user: process.env.USER_EMAIL,
    pass: process.env.PASS_EMAIL,
  },
});

router.post("/register", userContr.register);

router.post("/login", userContr.login);

router.get("/logout", userContr.logout);

router.get("/refesh_token", userContr.refeshToken);

router.get("/infousr", auth, userContr.getUser);

/* router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user).select("-passwordHash");
    res.json(user);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server Error");
  }
}); */
module.exports = router;
