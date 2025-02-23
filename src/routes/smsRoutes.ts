import { Router } from "express";
import { triggerSms } from "../controllers/smsController";

const router = Router();
router.post("/", triggerSms);

export { router as smsRouter };
