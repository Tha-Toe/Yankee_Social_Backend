const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");
const random = require("mongoose-simple-random");

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  nameKey: { type: String },
  email: { type: String, required: true },
  password: { type: String, required: true },
  tokens: {},
  caption: { type: String },
  likes: { type: Number, default: 0 },
  profileImage: { data: Buffer, contentType: String },
  coverPhoto: { data: Buffer, contentType: String },
  following: {
    followingAmount: { type: Number, default: 0 },
    followingPeople: [],
  },
  follower: {
    followerAmount: { type: Number, default: 0 },
    followerPeople: [],
  },
});
userSchema.methods.generateAuthToken = async function () {
  const token = await jwt.sign({ _id: this._id }, process.env.PRIVATEKEY);
  return token;
};
const User = mongoose.model("user", userSchema);

//validate
const validate = (data) => {
  const complexityOption = {
    min: 4,
    max: 30,
    lowerCase: 1,
    upperCase: 1,
    requirementCount: 2,
  };
  const schema = Joi.object({
    firstName: Joi.string().required().label("First Name"),
    lastName: Joi.string().required().label("Last Name"),
    email: Joi.string().email().required().label("Email"),
    password: passwordComplexity(complexityOption).required().label("Password"),
  });
  return schema.validate(data);
};

//post
const postSchema = new mongoose.Schema({
  ownerEmail: { type: String },
  uploadTime: {
    uploadSeconds: { type: String },
    uploadDate: { type: String },
  },
  caption: { type: String },
  postImage: { data: Buffer, contentType: String },
  like: [],
  comment: [
    {
      commentOwner: { type: String },
      commentText: { type: String },
      commentUploadTime: {
        uploadSeconds: { type: String },
        uploadDate: { type: String },
      },
    },
  ],
});
const Post = mongoose.model("post", postSchema);

module.exports = { User, Post, validate };
