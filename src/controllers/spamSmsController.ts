import { Request, Response } from "express";
import { wss } from "../server";
import { WebSocket } from "ws";

export const triggerSpamSms = (req: Request, res: Response) => {
  wss.clients.forEach((client: WebSocket) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ event: "spam-sms", message: "spam sms triggered" }));
    }
  });
  res.send("spam sms triggered");
};