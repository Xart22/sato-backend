const router = require("express").Router();
const cloudnary = require("cloudinary");
const auth = require("../middleware/auth");
const authAdmin = require("../middleware/authAdmin");
const fs = require("fs");

cloudnary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

router.post("/upload", (req, res) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      remove(file.tempFilePath);
      return res.status(400).send("No files");
    }

    const file = req.files.file;
    if (file.size > 1024 * 1024 * 3) {
      remove(file.tempFilePath);
      return res.status(400).json({ message: "file to large" });
    }

    if (
      file.mimetype !== "image/png" &&
      file.mimetype !== "image/jpg" &&
      file.mimetype !== "image/jpeg"
    ) {
      remove(file.tempFilePath);
      return res.status(400).json({ message: "File format incorrect" });
    }

    cloudnary.v2.uploader.upload(
      file.tempFilePath,
      { folder: "sato-ecommerce" },
      async (err, result) => {
        if (err) throw err;
        remove(file.tempFilePath);
        res.json({ public_id: result.public_id, url: result.secure_url });
      }
    );
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err.message });
  }
});
const remove = (path) => {
  fs.unlink(path, (err) => {
    if (err) throw err;
  });
};

router.delete("/deleteimg", (req, res) => {
  try {
    const { public_id } = req.body;
    if (!public_id) return res.status(400).json({ message: "File Not Found" });
    cloudnary.v2.uploader.destroy(public_id, async (err, result) => {
      if (err) throw err;
      res.json({ message: "Succes" });
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});
module.exports = router;
