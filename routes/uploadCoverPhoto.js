const router = require("express").Router();
const { User } = require("../models/model");
const multer = require("multer");
const fs = require("fs");
const sharp = require("sharp");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now());
  },
});

let upload = multer({ storage: storage });

router.post("/", upload.single("cover_photo"), async (req, res) => {
  try {
    let image = req.file.path;
    if (
      !req.file.mimetype.includes("jpeg") &&
      !req.file.mimetype.includes("png") &&
      !req.file.mimetype.includes("jpg")
    ) {
      fs.unlinkSync(image);
      return res.status(400).send({ message: "File not support" });
    }
    var img = fs.readFileSync(req.file.path);
    var encode_img = img.toString("base64");

    var bufferRawImage = new Buffer(encode_img, "base64");
    var resizedImageBase64;

    await sharp(bufferRawImage)
      .resize(300, 60)
      .toBuffer()
      .then((resizedImageBuffer) => {
        resizedImageBase64 = resizedImageBuffer.toString("base64");
      })
      .catch((error) => {
        // error handeling
        console.log("error" + error);
      });

    var final_img = {
      contentType: req.file.mimetype,
      data: new Buffer(resizedImageBase64, "base64"),
    };
    const coverPhoto = { coverPhoto: final_img };
    await User.findOneAndUpdate({ email: req.body.email }, coverPhoto, {
      new: true,
      runValidators: true,
    });
    return res
      .status(200)
      .send({ message: "Cover Photo Upload Was Successful" });
  } catch (error) {
    if (error)
      return res
        .status(500)
        .send({ message: "Server Internal Error. Try again" });
  }
});

module.exports = router;
