import { Router } from "express";
import { postStream, getIndex, handleIncomingSms } from "../controllers/twilioController.js";

const twilioRouter = Router();

twilioRouter.post("/", postStream);
twilioRouter.get("/", getIndex);
twilioRouter.post("/incoming-sms", handleIncomingSms);

export default twilioRouter