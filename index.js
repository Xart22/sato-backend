const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");

dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// DB & SERVER
mongoose
  .connect(process.env.DB_CON, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB Connected");
    return app.listen({ port: PORT });
  })
  .then((res) => {
    console.log(`Server running`);
  })
  .catch((err) => {
    console.error(err);
  });
app.use(cookieParser());
app.use(cors());

app.use("/api/auth", require("./routers/authRouter"));
app.use("/api", require("./routers/categoryRouter"));

app.use((req, res) => {
  res.status(404).json({
    success: false,
    msg: "Page Not Founded",
  });
});
