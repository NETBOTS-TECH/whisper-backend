import { Router } from "express";
import { postStream, getIndex } from "../controllers/twilioController.js";

const twilioRouter = Router();

twilioRouter.post("/", postStream);
twilioRouter.get("/", getIndex);

export default twilioRouter;
