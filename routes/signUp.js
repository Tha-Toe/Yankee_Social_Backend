const router = require("express").Router();
const { User, validate } = require("../models/model");
const bcrypt = require("bcrypt");

router.post("/", async (req, res) => {
  try {
    const { error } = await validate(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const user = await User.findOne({ email: req.body.email });
    if (user)
      return res
        .status(403)
        .send({ message: "User with given email already exist!" });

    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    await new User({ ...req.body, password: hashPassword }).save();
    const users = await User.findOne({ email: req.body.email });
    const tokens = { tokens: await users.generateAuthToken() };
    const randomNumber = Math.floor(Math.random() * 1000);
    const nameKey = {
      nameKey:
        "@" +
        (await users.firstName.toLowerCase().split(" ").join("")) +
        (await users.lastName.toLowerCase().split(" ").join("")) +
        randomNumber.toString(),
    };
    const userName = {
      userName: (await users.firstName) + " " + (await users.lastName),
    };
    await User.findOneAndUpdate({ email: req.body.email }, tokens, {
      new: true,
      runValidators: true,
    });
    await User.findOneAndUpdate({ email: req.body.email }, nameKey, {
      new: true,
      runValidators: true,
    });
    await User.findOneAndUpdate({ email: req.body.email }, userName, {
      new: true,
      runValidators: true,
    });
    res.status(200).send({ message: "Account created successfully." });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server Internal Error" });
  }
});

module.exports = router;
