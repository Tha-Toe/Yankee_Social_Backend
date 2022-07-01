const router = require("express").Router();
const { Post } = require("../models/model");

router.post("/", async (req, res) => {
  try {
    let commentDataForDelete = await req.body.commentDataForDelete;
    let _id = await req.body._id;
    await Post.findOneAndUpdate(
      { _id: _id },
      { $pull: { comment: commentDataForDelete } }
    );
    return res.status(200).send({ message: "Success delete comment" });
  } catch (error) {
    if (error)
      return res.status(500).send({ message: "Internal Server Error" });
  }
});

module.exports = router;
