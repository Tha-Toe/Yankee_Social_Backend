const router = require("express").Router();
const { Post } = require("../models/model");

router.post("/", async (req, res) => {
  if (req.body.getRandomPostData) {
    try {
      const randomPostData = await Post.aggregate([{ $match: {} }])
        .sample(30)
        .sort({ "uploadTime.uploadSeconds": -1 });
      //console.log("it's here1");
      //console.log(randomSuggestEmail);
      return res.status(200).send({ randomPostData: randomPostData });
    } catch (error) {
      console.log(error);
      if (error) return res.status(500).send({ message: "Inter Server Error" });
    }
  }
  if (req.body.getMyAllPostData && req.body.myEmail) {
    //console.log(req.body.myEmail);
    //console.log("start");
    try {
      const result = await Post.find({
        ownerEmail: { $regex: "^" + req.body.myEmail, $options: "i" },
      }).sort({ "uploadTime.uploadSeconds": -1 });
      return res.status(200).send({
        message: "Get my post data successfully",
        myAllPostData: result,
      });
    } catch (error) {
      if (error) console.log(error);
      return res.status(500).send({ message: "Internal Server Error" });
    }
  }
});
module.exports = router;
