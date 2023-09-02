const express = require("express");
const {
  registerUser,
  loginUser,
  allUsers,
} = require("../controllers/userController");
const { protectUser } = require("../midlewere/protectUser");

const router = express.Router();

router.route("/register/new").post(registerUser);
router.route("/login").post(loginUser);
router.route("/all").get(protectUser, allUsers);

module.exports = router;
