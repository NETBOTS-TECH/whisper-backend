import { Router } from "express";
import { triggerSpamCall } from "../controllers/spamCallController";

const router = Router();
router.post("/", triggerSpamCall);

export { router as spamCallRouter };