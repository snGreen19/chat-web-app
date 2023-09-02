const generateToken = require("../config/generateToken");
const asyncHandler = require("express-async-handler");
const User = require("../Models/userModels");
const cloudinary = require("cloudinary").v2;

// register a new user
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, localImage } = req.body;

  const uploadImage = async (file) => {
    const response = await cloudinary.uploader.upload(file, {
      cloud_name: "dpynprxka",
      api_key: "822952721637294",
      api_secret: "Kc3k18i37qWCJF8CpQZ4WykGqlU",
    });

    return response;
  };

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400).send({ err: "user has already exists" });
    return;
  }

  const imagePreUrl = await uploadImage(localImage);
  const image = imagePreUrl.secure_url;

  const user = await User.create({ name, email, password, image });
  if (user) {
    res.send({
      id: user._id,
      name: user.name,
      email: user.email,
      password: user.password,
      image: user.image,
      token: generateToken(user._id),
    });
  }
});

// login a registered user
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    res.status(400).send({ message: "wrong email or password" });
    return;
  }
  const matchPassword = await user.matchPassword(password);
  if (!matchPassword) {
    res.status(400).send({ message: "wrong email or password" });
    return;
  }
  if (user && matchPassword) {
    res.send({
      id: user._id,
      name: user.name,
      email: user.email,
      image: user.image,
      message: "login successfully",
      token: generateToken(user._id),
    });
  } else {
    res.status(400).send({ message: "please sign up for login" });
  }
});

// get all user by search
const allUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  res.send(users);
});

module.exports = { registerUser, loginUser, allUsers };
