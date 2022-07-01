const router = require("express").Router();
const { Post } = require("../models/model");

router.post("/", async (req, res) => {
  if (req.body.commentText && req.body.commentOwner && req.body._id) {
    //console.log(req.body.commentText);
    const commentOwner = await req.body.commentOwner;
    const commentText = await req.body.commentText;
    const _id = await req.body._id;
    const date = new Date();
    const uploadSeconds = await date.getTime();
    const uploadDate = await date.toLocaleDateString();
    const commentUploadTime = {
      uploadSeconds: uploadSeconds,
      uploadDate: uploadDate,
    };
    const commentUploadFullStructure = {
      commentOwner: commentOwner,
      commentText: commentText,
      commentUploadTime: commentUploadTime,
    };

    await Post.findOneAndUpdate(
      { _id: _id },
      { $push: { comment: commentUploadFullStructure } }
    );
    console.log("done");
    return res.status(200).send({ message: "success upload comment" });
  } else {
    return res.status(401).send({ message: "Request not perfect" });
  }
});
module.exports = router;
