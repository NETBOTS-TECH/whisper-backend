import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import path, { dirname, join } from 'node:path';
import OpenAI from 'openai';
import 'dotenv/config';
import twilioRouter from './routes/twilioRoutes.js';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] },
});

app.use('/tts', express.static(join(__dirname, 'tts_responses')));

// Serve TTS files via HTTP
const ttsDir = join(__dirname, 'tts_responses');
if (!fs.existsSync(ttsDir)) fs.mkdirSync(ttsDir);
app.use('/tts', express.static(ttsDir));

app.use("/twilio", twilioRouter);

const connectedClients = new Set();

io.on('connection', (socket) => {
  connectedClients.add(socket.id);
  console.log('Device connected:', socket.id)
  socket.data.transcript = "";
  socket.data.startTime = null;
  socket.data.isResponding = false;

  socket.on('disconnect', () => {
    console.log('Device disconnected:', socket.id)

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
    try {
      const tempFilePath = join(__dirname, `temp-${Date.now()}-${socket.id}.webm`);
      fs.writeFileSync(tempFilePath, Buffer.from(buffer));
  
      const transcription = await openai.audio.transcriptions.create({
        file: fs.createReadStream(tempFilePath),
        model: 'whisper-1',
        language: 'en'
      });
  
      fs.unlinkSync(tempFilePath);
  
      console.log(`Transcription from ${socket.id}: ${transcription.text}`);
      
      // Send transcription to the receiver
      socket.broadcast.emit('transcription', { text: transcription.text });
  
      if (!socket.data.startTime) socket.data.startTime = Date.now();
      const elapsedSeconds = (Date.now() - socket.data.startTime) / 1000;
  
      if (elapsedSeconds >= 2 && !socket.data.isResponding) {
        socket.data.isResponding = true;
        let finalBotResponse = "";
  
        if (transcription.text.toLowerCase().includes("win")) {
          finalBotResponse = `What did I win?`;
        } else {
          const chatResponse = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
              {
                role: 'user',
                content: "So the following response is from a spammer, waste his time by being annoying, the responses should directly start just direct answers: "
                  + transcription.text
              }
            ],
            temperature: 0.5,
            max_tokens: 100,
          });
  
          finalBotResponse = chatResponse.choices[0].message.content;
          const funLines = [
            "Are you selling me a yacht?",
            "Is that the best you got?",
            "Tell me more about your secret scheme!",
            "I must say, your offer is almost as shiny as my code.",
            "Do you have a spare ticket to Mars?"
          ];
          finalBotResponse += " " + funLines[Math.floor(Math.random() * funLines.length)];
        }
  
        console.log(`Bot Response: ${finalBotResponse}`);
  
        // Send the text response to the receiver
        socket.broadcast.emit('bot-text-response', { text: finalBotResponse });
  
        // Generate TTS audio
        const mp3 = await openai.audio.speech.create({
          model: "tts-1",
          voice: "ash",
          input: finalBotResponse,
        });
  
        const ttsFileName = `tts_${Date.now()}_${socket.id}.mp3`;
        const ttsFilePath = join(ttsDir, ttsFileName);
        const arrayBuffer = await mp3.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        fs.writeFileSync(ttsFilePath, buffer);
  
        // Send the TTS audio **only to the caller**
        socket.emit('model-response-audio', buffer);
  
        socket.data.startTime = Date.now();
        socket.data.isResponding = false;
      }
    } catch (error) {
      console.error("Error processing audio chunk:", error);
    }
  });
  



  
});

const PORT =  process.env.PORT || 3001
server.listen(PORT  ,() => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
