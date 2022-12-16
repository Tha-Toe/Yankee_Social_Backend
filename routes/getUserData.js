const router = require("express").Router();
const { User } = require("../models/model");

router.post("/", async (req, res) => {
  try {
    let email = await req.body.email;
    //console.log(email);
    if (!email) return res.status(400).send({ message: "Email is undefined" });
    const user = await User.findOne({ email: email });
    res
      .status(200)
      .header("Access-Control-Allow-Origin", "*")
      .send({ userData: user, message: "Get User Data Successfully" });
  } catch (error) {
    if (error)
      return res.status(500).send({ message: "Server Internal Error" });
  }
});

module.exports = router;
