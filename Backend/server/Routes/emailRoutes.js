const express = require("express");
const multer = require("multer");
const { sendCampaignEmail } = require("../controllers/emailController");

const router = express.Router();
const upload = multer(); // handles multipart/form-data with text only

router.post("/send", upload.none(), sendCampaignEmail);

module.exports = router;
