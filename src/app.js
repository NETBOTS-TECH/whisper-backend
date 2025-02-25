import 'dotenv/config'
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import FormData from 'form-data';
import axios from 'axios'


const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});

io.on('connection', (socket) => {
    console.log('Connected')
    socket.on('audio-chunk', async (chunk) => {
        const audioBuffer = Buffer.from(new Uint8Array(chunk));
        const formData = new FormData();
        formData.append('file', audioBuffer, { filename: 'chunk.webm', contentType: 'audio/webm' });
        formData.append('model', 'whisper-1');
        try {
            const res = await axios.post('https://api.openai.com/v1/audio/transcriptions', formData, {
                headers: {
                    'Authorization': `Bearer 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`,
                    ...formData.getHeaders(),
                },
            });
            socket.emit('transcription', { text: res.data.text });
        } catch (err) {
            console.error(err);
        }
    });

    socket.on('end-call', () => { });
});

server.listen(3000, () => {
    console.log('Listening on http://localhost:3000');
});
