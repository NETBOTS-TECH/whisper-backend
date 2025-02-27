# WhisperWize - AI-Powered Spam Call Detection

WhisperWize is an AI-powered backend that helps detect and deter spam/bot calls using OpenAI's **Whisper** (for speech-to-text transcription) and **GPT-4** (for generating responses). The app listens to incoming calls, transcribes audio, analyzes it for spam, and responds in an engaging way to waste the spammer's time.

## Features
- **Real-time speech-to-text transcription** using OpenAI Whisper.
- **Spam detection** based on keyword matching and GPT-based analysis.
- **Conversational AI response** that engages spam calls with humorous and time-wasting replies.
- **Text-to-speech (TTS) generation** to respond to calls audibly.
- **WebSocket-based communication** for real-time interaction.

## Installation & Setup

### Prerequisites
- **Node.js** (>= 16.x)
- **npm** or **yarn**
- **Twilio Account** (if integrating with Twilio)
- **OpenAI API Key**

### Clone the Repository
```sh
 git clone https://github.com/NETBOTS-TECH/whisper-backend
 cd whisperwize
```

### Install Dependencies
```sh
npm install
```

### Set Up Environment Variables
Create a `.env` file in the root directory and add the following:
```sh
OPENAI_API_KEY=your_openai_api_key
PORT=3000
```

### Start the Server
```sh
npm run dev
```
The server will run at `http://localhost:3000`.

## Usage

### WebSocket Events
- **`call-user`** - Initiates a call.
- **`incoming-call`** - Notifies users of an incoming call.
- **`audio-chunk`** - Sends an audio chunk for transcription.
- **`transcription`** - Receives the transcribed text from the server.
- **`model-response`** - Receives an AI-generated text response.
- **`model-response-audio`** - Receives an AI-generated audio response.
- **`end-call`** - Ends an ongoing call.

### API Routes
#### Serve TTS Files
```sh
GET /tts/:filename
```

#### Twilio Webhook (if used)
```sh
POST /twilio/call-handler
```

## Tech Stack
- **Node.js** - Backend runtime.
- **Express.js** - Web framework.
- **Socket.io** - WebSocket communication.
- **OpenAI Whisper** - Speech-to-text transcription.
- **OpenAI GPT-4** - AI-generated responses.
- **Twilio** - Call handling (optional).

## Contributing
Feel free to submit pull requests! Please ensure your code follows the existing style and includes relevant tests.

## License
This project is licensed under the MIT License.
