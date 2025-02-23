import { Router } from "express";
import { triggerSpamSms } from "../controllers/spamSmsController";

const router = Router();
router.post("/", triggerSpamSms);

export { router as spamSmsRouter };