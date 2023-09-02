const express = require("express");
const { newMessage, allMessages } = require("../controllers/messageController");

const { protectUser } = require("../midlewere/protectUser");

const router = express.Router();

router.route("/new").post(protectUser, newMessage);
router.route("/all/:chatId").get(protectUser, allMessages);

module.exports = router;
