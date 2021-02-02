const express = require("express")
const mongoose = require("mongoose")
const dotenv = require("dotenv")

dotenv.config()



const PORT = process.env.PORT || 5000;
const app = express()
app.use(express.urlencoded({ extended: true }));
app.use(express.json())
// DB & SERVER
mongoose
  .connect(process.env.DB_CON, { useNewUrlParser: true,useUnifiedTopology:true })
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

app.use("/auth",require("./routers/userRouter"))