import { Request, Response } from "express";
import { wss } from "../server";
import { WebSocket } from "ws";

export const triggerCall = (req: Request, res: Response) => {
  wss.clients.forEach((client: WebSocket) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ event: "call", message: "simple call triggered" }));
    }
  });
  res.send("call triggered");
};
