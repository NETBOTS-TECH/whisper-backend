import { Router } from "express";
import { triggerCall } from "../controllers/callController";

const router = Router();
router.post("/", triggerCall);

export { router as callRouter };
