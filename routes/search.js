const router = require("express").Router();
const { User } = require("../models/model");

router.post("/", async (req, res) => {
  if (req.body.suggestEmail) {
    try {
      const suggestPeopleData = await User.findOne({
        email: req.body.suggestEmail,
      });
      if (!suggestPeopleData)
        return res.status(404).send({ message: "User with email not found" });
      res.status(200).send({ suggestPeopleData: suggestPeopleData });
    } catch (error) {
      if (error) return res.status(500).send({ message: "Inter Server Error" });
    }
  }
  if (req.body.getRandomSuggestEmail) {
    try {
      //console.log("it's start");
      const randomSuggestEmail = await User.aggregate([{ $match: {} }])
        .sample(30)
        .project({
          email: 1,
          _id: 0,
        });
      //console.log("it's here1");
      //console.log(randomSuggestEmail);
      return res.status(200).send({ randomSuggestEmail: randomSuggestEmail });
    } catch (error) {
      console.log(error);
      if (error) return res.status(500).send({ message: "Inter Server Error" });
    }
  }
  if (req.body.followerEmail) {
    try {
      const followerPeopleData = await User.findOne({
        email: req.body.followerEmail,
      });
      //console.log(followerPeopleData);

      if (!followerPeopleData)
        return res.status(404).send({ message: "User with email not found" });
      res.status(200).send({ followerPeopleData: followerPeopleData });
    } catch (error) {
      if (error) return res.status(500).send({ message: "Inter Server Error" });
    }
  }
  if (req.body.followingEmail) {
    try {
      const followingPeopleData = await User.findOne({
        email: req.body.followingEmail,
      });
      if (!followingPeopleData)
        return res.status(404).send({ message: "User with email not found" });
      res.status(200).send({ followingPeopleData: followingPeopleData });
      //console.log(followingPeopleData[0].firstName);
    } catch (error) {
      if (error) return res.status(500).send({ message: "Inter Server Error" });
    }
  }
  if (req.body.searchValue) {
    try {
      const userNameresult = await User.find({
        userName: { $regex: "^" + req.body.searchValue, $options: "i" },
      })
        .sort({ follower: 1 })
        .limit(20);
      if (userNameresult.length > 0) {
        return res
          .status(200)
          .send({ message: "Search User Successfully", searchResult: result });
      } else {
        const nameKeyresult = await User.find({
          nameKey: { $regex: "^" + req.body.searchValue, $options: "i" },
        })
          .sort({ follower: 1 })
          .limit(20);
        return res
          .status(200)
          .send({
            message: "Search User Successfully",
            searchResult: nameKeyresult,
          });
      }
    } catch (error) {
      if (error) console.log(error);
      return res.status(500).send({ message: "Internal Server Error" });
    }
  }
});
module.exports = router;
