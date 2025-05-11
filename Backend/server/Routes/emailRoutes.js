import express from "express";
import multer from "multer";
import { sendCampaignEmail } from "../controllers/emailController.js";

const router = express.Router();
const upload = multer(); // handles multipart/form-data with text only

router.post("/send", upload.none(), sendCampaignEmail);

export default router;
