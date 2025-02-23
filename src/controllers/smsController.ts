import { Request, Response } from "express";
import { wss } from "../server";
import { WebSocket } from "ws";

export const triggerSms = (req: Request, res: Response) => {
  wss.clients.forEach((client: WebSocket) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ event: "sms", message: "sms triggered" }));
    }
  });
  res.send("sms triggered");
};
