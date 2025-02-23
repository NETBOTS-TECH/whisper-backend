import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: "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",
});

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

const connectedClients = new Set();

// Per-socket recording state. We won't transcribe until we have ~30s of audio.
const recordingState = new Map(); // { socketId: { startTime: number, tempPath: string } }

io.on('connection', (socket) => {
  connectedClients.add(socket.id);
  console.log('New client connected:', socket.id);

  // Initialize a recording state entry
  recordingState.set(socket.id, {
    startTime: null,
    tempPath: join(__dirname, `temp_${socket.id}.webm`)
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    connectedClients.delete(socket.id);

    // Cleanup
    const state = recordingState.get(socket.id);
    if (state) {
      if (fs.existsSync(state.tempPath)) {
        fs.unlinkSync(state.tempPath);
        console.log(`Temporary file removed: ${state.tempPath}`);
      }
      recordingState.delete(socket.id);
    }
  });

  socket.on('call-user', () => {
    console.log('call-user event from:', socket.id);
    if (connectedClients.size < 2) {
      console.log('Only one user connected, sending "only-you" to:', socket.id);
      socket.emit('only-you');
    } else {
      console.log('Broadcasting "incoming-call" to others...');
      socket.broadcast.emit('incoming-call', { callerId: socket.id });
    }
  });

  socket.on('offer', (data) => {
    console.log('offer event from:', socket.id);
    socket.broadcast.emit('offer', data);
  });

  socket.on('answer', (data) => {
    console.log('answer event from:', socket.id);
    socket.broadcast.emit('answer', data);
  });

  socket.on('candidate', (data) => {
    console.log('candidate event from:', socket.id);
    socket.broadcast.emit('candidate', data);
  });

  socket.on('end-call', () => {
    console.log('end-call event from:', socket.id);
    socket.broadcast.emit('call-ended');
  });

  socket.on('audio-chunk', async (buffer) => {
    const filePath = join(__dirname, `temp-${Date.now()}-${socket.id}.webm`);
    fs.writeFileSync(filePath, Buffer.from(buffer));
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(filePath),
      model: 'whisper-1',
    });
    console.log(`Transcription from ${socket.id}: ${transcription.text}`);
    socket.emit('transcription', { text: transcription.text });
    fs.unlinkSync(filePath);
  });
  
});

server.listen(3000, () => {
  console.log('Server listening on http://localhost:3000');
});
