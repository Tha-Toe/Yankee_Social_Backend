const router = require("express").Router();
const { Post } = require("../models/model");

router.post("/", async (req, res) => {
  if (req.body.like && req.body._id) {
    const _id = req.body._id;
    const userEmail = req.body.userEmail;
    console.log(_id);
    try {
      let validatePost = await Post.findOne({
        _id: _id,
      });
      let index = await validatePost.like.indexOf(userEmail);
      console.log(index);
      if (index >= 0) return res.status(200).send({ message: "already like" });
      //console.log(index);
      await Post.findOneAndUpdate({ _id: _id }, { $push: { like: userEmail } });
      console.log("done like");
      return res.status(200).send({ message: "success like post" });
    } catch (error) {
      return res.status(500).send({ message: "Server Internal Error" });
    }
  }
  if (req.body.unLike && req.body._id) {
    const _id = req.body._id;
    console.log(_id);
    const userEmail = req.body.userEmail;
    try {
      let validatePost = await Post.findOne({
        _id: _id,
      });
      let index = await validatePost.like.indexOf(userEmail);
      console.log(index);
      if (index < 0)
        return res.status(200).send({ message: "Not already like post" });
      //const data = await Post.findOne({_id})
      await Post.findOneAndUpdate({ _id: _id }, { $pull: { like: userEmail } });
      console.log("done unlike");
      return res.status(200).send({ message: "success unlike post" });
    } catch (error) {
      return res.status(500).send({ message: "Server Internal Error" });
    }
  }
});
module.exports = router;
