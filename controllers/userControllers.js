const bcrypt = require("bcrypt");
const router = require("express").Router();
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const { GoogleAuth } = require("google-auth-library");
const fetch = require("node-fetch");
const nodemailer = require("nodemailer");
const gravatar = require("gravatar");
const auth = require("../middleware/auth");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  auth: {
    user: process.env.USER_EMAIL,
    pass: process.env.PASS_EMAIL,
  },
});

const userContr = {
  register: async (req, res) => {
    try {
      const { email, password, passwordVertif, username } = req.body;
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      const avatar = gravatar.url(email, {
        s: "200",
        r: "pg",
        d: "mm",
      });

      if (!email)
        return res
          .status(400)
          .json({ errorMassage: "Email must not be empty" });

      if (!email.match(re))
        return res
          .status(400)
          .json({ errorMassage: "Email must be a valid email address" });

      if (!email || !password || !passwordVertif)
        return res.status(400).json({ errorMassage: "Please Check Your data" });

      if (password.lenght < 8)
        return res
          .status(400)
          .json({ errorMassage: "Password Must Be 8 character" });

      if (password !== passwordVertif)
        return res.status(400).json({ errorMassage: "Password do not match" });

      const existEmail = await User.findOne({ email });
      if (existEmail)
        return res
          .status(400)
          .json({ errorMassage: "Email already exists, please login" });

      const passwordHash = await bcrypt.hash(password, 10);
      const newUser = new User({
        username,
        email,
        passwordHash,
      });
      await newUser.save();

      const token = jwt.sign(
        {
          id: newUser._id,
        },
        process.env.JWT_TOKEN,
        {
          expiresIn: "1d",
        }
      );
      const refeshToken = jwt.sign(
        {
          id: newUser._id,
        },
        process.env.JWT_REFESH_TOKEN,
        {
          expiresIn: "7d",
        }
      );
      res.cookie("refeshtoken", refeshToken, {
        httpOnly: true,
        path: "/api/auth/refesh_token",
      });

      /*     const emailData = {
                from: '"Activaction Account" <satorecloud@gmail.com',
                to: email,
                subject: "Account Activation",
                html: `
                          <h1>Click here to active your account</h1>
                          <p>${process.env.CLIENT_URL}api/auth/activation/${tokenvertiv}</p>
                          <hr/>
                          <p>This email contain sensitive info</p>
                          <p>${process.env.CLIEN_URL}</p>
                          `,
              };
              transporter.sendMail(emailData, (err, info) => {
                if (err) throw err;
                console.log("Email sent " + info.response);
              }); */
      res.json({ token }).send();
    } catch (error) {
      console.error(error);
      res.status(500).send();
    }
  },
  login: async (req, res) => {
    try {
      var { email, password, username } = req.body;

      let conditions = !!username
        ? (username = { username })
        : (email = { email });
      if (!conditions || !password)
        return res.status(400).json({ errorMassage: "Please Check Your data" });

      const userexist = await User.findOne(conditions);
      if (!userexist)
        return res
          .status(400)
          .json({ errorMassage: "Email or username not registered" });

      const passwordCorrect = await bcrypt.compare(
        password,
        userexist.passwordHash
      );
      if (!passwordCorrect)
        return res
          .status(400)
          .json({ errorMassage: "Wrong email or password" });
      const token = jwt.sign(
        {
          user: userexist._id,
        },
        process.env.JWT_TOKEN,
        {
          expiresIn: "1d",
        }
      );
      const refeshToken = jwt.sign(
        {
          user: userexist._id,
        },
        process.env.JWT_REFESH_TOKEN,
        {
          expiresIn: "7d",
        }
      );
      res.cookie("refeshtoken", refeshToken, {
        httpOnly: true,
        path: "/api/auth/refesh_token",
      });
      res.json({ token }).send();
    } catch (error) {
      console.error(error);
      res.status(500).send();
    }
  },
  refeshToken: (req, res) => {
    try {
      const rfs_token = req.cookies.refeshtoken;
      if (!rfs_token)
        return res.status(400).json({ message: "Please Login or Register" });

      jwt.verify(rfs_token, process.env.JWT_REFESH_TOKEN, (err, user) => {
        if (err)
          return res.status(400).json({ message: "Please Login or Register" });
        const token = jwt.sign(
          {
            user,
          },
          process.env.JWT_TOKEN,
          {
            expiresIn: "1d",
          }
        );
        res.json({ user, token });
      });
    } catch (error) {
      console.error(error);
      res.status(500).send();
    }
  },
  logout: async (req, res) => {
    try {
      res.clearCookie("refeshtoken", { path: "/api/auth/refesh_token" });
      return res.json({ message: "oke!" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error });
    }
  },
  getUser: async (req, res) => {
    try {
      const user = await User.findById(req.user).select("-passwordHash");
      if (!user) return res.status(400).json({ msg: "not found" });
      res.json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error });
    }
  },
};

module.exports = userContr;
