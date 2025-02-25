import express from 'express';
import { createServer } from 'http';
import fs from 'fs';
import { join } from 'path';
import { Server } from 'socket.io';
import { dirname } from 'node:path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  let chunkCounter = 0;
  
  socket.on('audio-chunk', (chunk) => {
    const fileBuffer = Buffer.from(chunk);
    const filename = join(__dirname, `recording-${socket.id}-${chunkCounter++}.webm`);
    fs.writeFile(filename, fileBuffer, (err) => {
      if (err) console.error(`Error saving ${filename}:`, err);
      else console.log(`Saved ${filename}`);
    });
  });
  
  socket.on('stop-recording', () => {
    console.log(`Recording stopped for ${socket.id}`);
  });
  
  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

server.listen(3000, () => console.log('Server running on http://localhost:3000'));
