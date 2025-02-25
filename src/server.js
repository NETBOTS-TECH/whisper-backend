// Full backend code with immediate transcription and emission for each chunk.
import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import OpenAI from 'openai';
import 'dotenv/config';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] },
});

const connectedClients = new Set();

io.on('connection', (socket) => {
  connectedClients.add(socket.id);
  console.log('New client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    connectedClients.delete(socket.id);
  });

  socket.on('call-user', () => {
    if (connectedClients.size < 2) {
      socket.emit('only-you');
    } else {
      socket.broadcast.emit('incoming-call', { callerId: socket.id });
    }
  });

  socket.on('offer', (data) => {
    socket.broadcast.emit('offer', data);
  });

  socket.on('answer', (data) => {
    socket.broadcast.emit('answer', data);
  });

  socket.on('candidate', (data) => {
    socket.broadcast.emit('candidate', data);
  });

  socket.on('end-call', () => {
    socket.broadcast.emit('call-ended');
  });

  socket.on('audio-chunk', async (buffer) => {
    const filePath = join(__dirname, `temp-${Date.now()}-${socket.id}.webm`);
    fs.writeFileSync(filePath, Buffer.from(buffer));
    try {
      const transcription = await openai.audio.transcriptions.create({
        file: fs.createReadStream(filePath),
        model: 'whisper-1',
      });
      console.log(`Transcription from ${socket.id}: ${transcription.text}`);
      socket.emit('transcription', { text: transcription.text });
    } catch (err) {
      console.error('Transcription error:', err);
    } finally {
      fs.unlinkSync(filePath);
    }
  });
});

server.listen(3000, () => {
  console.log('Server listening on http://localhost:3000');
});
