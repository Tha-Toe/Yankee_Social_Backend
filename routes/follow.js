const router = require("express").Router();
const { User } = require("../models/model");
router.post("/", async (req, res) => {
  console.log("start function");
  let myFollowing = await User.findOne({ email: req.body.myEmail });
  let otherPeopleFollower = await User.findOne({
    email: req.body.otherEmail,
  });
  let otherEmailIAlreadyFollow = req.body.otherEmail;
  if (
    myFollowing.following.followingPeople.indexOf(otherEmailIAlreadyFollow) >= 0
  ) {
    try {
      //mySide Unfollow
      let myEmail = req.body.myEmail;
      let otherEmail = req.body.otherEmail;
      console.log("unfollow 0%" + otherEmail);

      await User.findOneAndUpdate(
        { email: myEmail },
        { $pull: { "following.followingPeople": otherEmail } },
        { new: true, runValidators: true }
      );
      console.log("unfollow 50%" + otherEmail);

      //otherSide Unfollow

      console.log("unfollow 75%" + otherEmail);

      await User.findOneAndUpdate(
        { email: otherEmail },
        { $pull: { "follower.followerPeople": myEmail } },
        { new: true, runValidators: true }
      );
      console.log("unfollow 100%" + otherEmail);
      console.log("success remove" + otherEmail);
      return res.status(200).send({ message: "success unfollow" });
    } catch (error) {
      return res.status(500).send({ message: "Server Internal Error" });
    }
  } else {
    try {
      //my side Follow
      let myEmail = req.body.myEmail;
      let otherEmail = req.body.otherEmail;
      console.log("follow 0%" + otherEmail);

      await User.findOneAndUpdate(
        { email: myEmail },
        { $push: { "following.followingPeople": otherEmail } },
        { new: true, runValidators: true }
      );
      console.log("follow 50%" + otherEmail);

      //otherSide Follow
      let follower = otherPeopleFollower.follower;
      if (follower.followerPeople.indexOf(myEmail) >= 0)
        return res.status(200).send({ message: "You already follow" });
      console.log("follow 75%" + otherEmail);

      await User.findOneAndUpdate(
        { email: otherEmail },
        { $push: { "follower.followerPeople": myEmail } },
        { new: true, runValidators: true }
      );

      console.log("follow 100%" + otherEmail);
      console.log("success add");
      return res.status(200).send({ message: "success follow" });
    } catch (error) {
      return res.status(500).send({ message: "Server Internal Error" });
    }
  }
});
module.exports = router;
