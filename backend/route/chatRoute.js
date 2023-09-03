const express = require("express");
const {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  removeFromGroup,
  addToGroup,
} = require("../controllers/chatController");
const { protectUser } = require("../midlewere/protectUser");

const router = express.Router();

// all chat route here
router.route("/access").post(protectUser, accessChat);
router.route("/allchat").get(protectUser, fetchChats);
router.route("/group").post(protectUser, createGroupChat);
router.route("/rename").put(protectUser, renameGroup);
router.route("/groupremove").put(protectUser, removeFromGroup);
router.route("/groupadd").put(protectUser, addToGroup);

module.exports = router;
