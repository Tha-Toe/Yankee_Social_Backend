require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const connectDB = require("./db");
const signUpRoute = require("./routes/signUp");
const logInRoute = require("./routes/auth");
const checkTokenRoute = require("./routes/checktoken");
const searchRoute = require("./routes/search");
const uploadprofileimageRoute = require("./routes/uploadProfileImage");
const uploadcoverPhotoRoute = require("./routes/uploadCoverPhoto");
const followRoute = require("./routes/follow");
const getUserDataRoute = require("./routes/getUserData");
const uploadPost = require("./routes/uploadPost");
const getPostData = require("./routes/getPostData");
const deletePost = require("./routes/deletePost");
const likePost = require("./routes/likePost");
const uploadComment = require("./routes/uploadComment");
const deleteComment = require("./routes/deletecomment");
var fileupload = require("express-fileupload");

var corsOptions = {
  origin: ["http://localhost:3000", "https://yankee.vercel.app"],
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(fileupload());
connectDB();

app.use("/api/signup", signUpRoute);
app.use("/api/login", logInRoute);
app.use("/api/checktoken", checkTokenRoute);
app.use("/api/search", searchRoute);
app.use("/api/uploadprofileimage", uploadprofileimageRoute);
app.use("/api/uploadcoverphoto", uploadcoverPhotoRoute);
app.use("/api/follow", followRoute);
app.use("/api/getuserdata", getUserDataRoute);
app.use("/api/uploadpost", uploadPost);
app.use("/api/getpostdata", getPostData);
app.use("/api/deletepost", deletePost);
app.use("/api/likepost", likePost);
app.use("/api/uploadcomment", uploadComment);
app.use("/api/deletecomment", deleteComment);

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Server is listening on port ${port}...`));
