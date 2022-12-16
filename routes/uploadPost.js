const router = require("express").Router();
// const multer = require("multer");
const fs = require("fs");
const sharp = require("sharp");
const { Post } = require("../models/model");

// var storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads");
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.fieldname + "-" + Date.now());
//   },
// });
// let upload = multer({ storage: storage });

// const upload = multer({ dest: "uploads/" });

//upload.single("post_pic"),
//
router.post("/", async (req, res) => {
  try {
    let rawPostSchema = {};
    console.log(req.files.post_pic);
    //email
    rawPostSchema.ownerEmail = req.body.email;
    let uploadRawTime = new Date();
    let uploadTime = uploadRawTime.getTime();
    let uploadDate = uploadRawTime.toLocaleDateString();
    let rawTimeObject = { uploadSeconds: uploadTime, uploadDate: uploadDate };
    rawPostSchema.uploadTime = rawTimeObject;
    //caption
    if (req.body.caption) {
      rawPostSchema.caption = req.body.caption;
    }

    //image with multer
    // if (req.file) {
    //   let image = req.file.path;
    //   console.log(image);

    //   if (
    //     !req.file.mimetype.includes("jpeg") &&
    //     !req.file.mimetype.includes("png") &&
    //     !req.file.mimetype.includes("jpg")
    //   ) {
    //     fs.unlinkSync(image);
    //     return res.status(400).send({ message: "File not support" });
    //   }
    //   var img = fs.readFileSync(req.file.path);
    //   console.log(img);
    //   var encode_img = img.toString("base64");
    //   var bufferRawImage = new Buffer(encode_img, "base64");
    //   var resizedImageBase64;
    //   await sharp(bufferRawImage)
    //     .resize({ width: 500 })
    //     .toBuffer()
    //     .then((resizedImageBuffer) => {
    //       resizedImageBase64 = resizedImageBuffer.toString("base64");
    //     })
    //     .catch((error) => {
    //       // error handeling
    //       console.log("error" + error);
    //     });

    //   rawPostSchema.postImage = {
    //     contentType: req.file.mimetype,
    //     data: new Buffer(resizedImageBase64, "base64"),
    //   };
    // }

    //image with express file upload
    if (req.files?.post_pic) {
      let image = req.files.post_pic;
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
        .resize({ width: 500 })
        .toBuffer()
        .then((resizedImageBuffer) => {
          resizedImageBase64 = resizedImageBuffer.toString("base64");
        })
        .catch((error) => {
          // error handeling
          console.log("error" + error);
        });

      rawPostSchema.postImage = {
        contentType: image.mimetype,
        data: Buffer.from(resizedImageBase64, "base64"),
      };
    }

    //like

    await new Post(rawPostSchema).save();
    console.log("post uploaded");
    return res.status(200).send({ message: "Success Upload" });
  } catch (error) {
    return res.status(500).send({ message: "Server Internal Error" });
  }
});

module.exports = router;
