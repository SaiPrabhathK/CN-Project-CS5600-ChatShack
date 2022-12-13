const Messages = require("../models/messageModel");
const User = require("../models/userModel");
const CryptoJS = require("crypto-js");

module.exports.getMessages = async (req, res, next) => {
  try {
    const { from, to } = req.body;
    const senderKey = await User.findById(from, "secretKey").exec().toString();
    const receiverKey = await User.findById(to, "secretKey").exec().toString();

    const messages = await Messages.find({
      users: {
        $all: [from, to],
      },
    }).sort({ updatedAt: 1 });

    const projectedMessages = messages.map((msg) => {
      console.log(msg)
      return {
        message_id: msg._id, 
        message_deleted: msg.message.is_deleted || false, 
        fromSelf: msg.sender.toString() === from,
        message: CryptoJS.AES.decrypt(msg.message.text, senderKey+receiverKey).toString(CryptoJS.enc.Utf8),
        created_at: msg.createdAt
      }
    });
    res.json(projectedMessages);
  } catch (ex) {
    next(ex);
  }
};

module.exports.addMessage = async (req, res, next) => {
  try {
    const { from, to, message } = req.body;
    const senderKey = await User.findById(from, "secretKey").exec().toString();
    const receiverKey = await User.findById(to, "secretKey").exec().toString();

    var encryptedMessage = CryptoJS.AES.encrypt(message, senderKey+receiverKey).toString();
    const data = await Messages.create({
      message: { text: encryptedMessage, message_created_at: (new Date()).toISOString() },
      users: [from, to],
      sender: from,
    });

    if (data) return res.json({ msg: "Message added successfully." });
    else return res.json({ msg: "Failed to add message to the database" });
  } catch (ex) {
    next(ex);
  }
};

module.exports.editMessage = async (req, res, next) => {
  try {
    const { from, to, message, message_id } = req.body;
    const senderKey = await User.findById(from, "secretKey").exec().toString();
    const receiverKey = await User.findById(to, "secretKey").exec().toString();

    var encryptedMessage = CryptoJS.AES.encrypt(message, senderKey+receiverKey).toString();
    const data = await Messages.updateOne({_id: message_id},{
      message: { text: encryptedMessage },
      // users: [from, to],
      // sender: from,
    });
    if (data) return res.json({ msg: "Message updated successfully." });
    else return res.json({ msg: "Failed to update message to the database" });
  } catch (ex) {
    next(ex);
  }
};

module.exports.deleteMessage = async (req, res, next) => {
  try {
    const { from, to, message, message_id } = req.body;
    const senderKey = await User.findById(from, "secretKey").exec().toString();
    const receiverKey = await User.findById(to, "secretKey").exec().toString();
      console.log("deleted")
    var encryptedMessage = CryptoJS.AES.encrypt(message, senderKey+receiverKey).toString();
    const data = await Messages.updateOne({_id: message_id},{
      $set: { "message.is_deleted":true },
      // users: [from, to],
      // sender: from,
    });
    if (data) return res.json({ msg: "Message updated successfully." });
    else return res.json({ msg: "Failed to update message to the database" });
  } catch (ex) {
    next(ex);
  }
};