import { Request, Response } from "express";
import { wss } from "../server";
import { WebSocket } from "ws";

export const triggerSpamCall = (req: Request, res: Response) => {
  wss.clients.forEach((client: WebSocket) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ event: "spam-call", message: "spam call triggered" }));
    }
  });
  res.send("spam call triggered");
};
