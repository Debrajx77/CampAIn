import express from "express";
import { sendCampaignEmail } from "../controllers/emailController.js";

const router = express.Router();

router.post("/send-email", sendCampaignEmail);

export default router;
