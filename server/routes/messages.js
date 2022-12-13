const { addMessage, getMessages, editMessage, deleteMessage } = require("../controllers/messageController");
const router = require("express").Router();

router.post("/addmsg/", addMessage);
router.post("/getmsg/", getMessages);
router.put("/updtmsg/", editMessage);
router.put("/delmsg/", deleteMessage);

module.exports = router;
