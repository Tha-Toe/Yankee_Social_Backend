const router = require("express").Router();
const { User } = require("../models/model");
const fs = require("fs");
const sharp = require("sharp");

router.post("/", async (req, res) => {
  try {
    let image = req.files.profile_pic;
    if (
      !image.mimetype.includes("jpeg") &&
      !image.mimetype.includes("png") &&
      !image.mimetype.includes("jpg")
    ) {
      return res.status(400).send({ message: "File not support" });
    }
    var imgData = image.data;
    console.log(imgData);
    var encode_img = imgData.toString("base64");
    var bufferRawImage = Buffer.from(encode_img, "base64");
    var resizedImageBase64;
    await sharp(bufferRawImage)
      .resize(100, 100)
      .toBuffer()
      .then((resizedImageBuffer) => {
        resizedImageBase64 = resizedImageBuffer.toString("base64");
      })
      .catch((error) => {
        // error handeling
        console.log("error" + error);
      });

    var final_img = {
      contentType: image.mimetype,
      data: Buffer.from(resizedImageBase64, "base64"),
    };
    const profileImage = { profileImage: final_img };
    await User.findOneAndUpdate({ email: req.body.email }, profileImage, {
      new: true,
      runValidators: true,
    });

    return res
      .status(200)
      .send({ message: "Profile image upload was successful" });
  } catch (error) {
    if (error) {
      console.log(error);
      return res
        .status(500)
        .send({ message: "Server Internal Error, try again." });
    }
  }
});
module.exports = router;
