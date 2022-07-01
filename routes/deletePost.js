const router = require("express").Router();
const { Post } = require("../models/model");

router.post("/", async (req, res) => {
  if (req.body._id) {
    try {
      let _id = req.body._id;
      await Post.findOneAndDelete(
        { _id: _id },
        { new: true, runValidators: true }
      );
      return res.status(200).send({ message: "success post delete" });
    } catch (error) {
      return res.status(500).send({ message: "Server Internal Error" });
    }
  } else {
    return res.status(404).send({ message: "id not found" });
  }
});

module.exports = router;
