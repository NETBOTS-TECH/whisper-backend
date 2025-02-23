import express from "express";
import { callRouter } from "./routes/callRoutes";
import { spamCallRouter } from "./routes/spamCallRoutes";
import { smsRouter } from "./routes/smsRoutes";
import { spamSmsRouter } from "./routes/spamSmsRoutes";

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("<h1>Hello world</h1>");
});

app.use("/call", callRouter);
app.use("/spam-call", spamCallRouter);
app.use("/sms", smsRouter);
app.use("/spam-sms", spamSmsRouter);

export { app };
