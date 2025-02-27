# WhisperWize - AI-Powered Spam Call Detection: Application 

**1. Introduction**

WhisperWize is an AI-powered backend that helps detect and deter spam/bot calls using OpenAI's **Whisper** (for speech-to-text transcription) and **GPT-4** (for generating responses). The app listens to incoming calls, transcribes audio, analyzes it for spam, and responds in an engaging way to waste the spammer's time.
**2. Application Architecture**

The application follows a modular architecture, organized into distinct directories for controllers, routes, socket handling, and TTS responses. It utilizes Node.js with Express.js for the backend framework and Socket.io for real-time WebSocket communication.

**2.1. Directory Structure**

netbots-tech-whisper-backend/
├── README.md
├── index.html
├── index.js
├── package.json
├── controllers/
│   └── twilioController.js
├── routes/
│   └── twilioRoutes.js
├── socket/
│   └── index.js
└── tts_responses/

* `README.md`: Provides an overview of the application, installation instructions, and usage guidelines.
* `index.html`: A basic HTML page for testing WebSocket communication.
* `index.js`: The main application file, handling server setup, socket connections, and OpenAI API interactions.
* `package.json`: Lists project dependencies and scripts.
* `controllers/twilioController.js`: Handles Twilio webhook requests, transcribing audio and generating TwiML responses.
* `routes/twilioRoutes.js`: Defines routes for Twilio integration.
* `socket/index.js`: Handles WebSocket connections and media processing.
* `tts_responses/`: Stores generated text-to-speech (TTS) audio files.

**2.2. Key Technologies**

* **Node.js**: Backend runtime environment.
* **Express.js**: Web application framework.
* **Socket.io**: Real-time WebSocket communication.
* **OpenAI Whisper**: Speech-to-text transcription.
* **OpenAI GPT-4**: AI-generated responses.
* **Twilio**: Call handling (optional).
* **WaveFile**: wave audio processing.

**3. Functionalities and Logic**

**3.1. WebSocket Communication**

The application uses Socket.io to establish real-time communication between clients.

* `call-user`: Initiates a call to another connected client.
* `incoming-call`: Notifies clients of an incoming call.
* `audio-chunk`: Sends audio chunks for transcription.
* `transcription`: Receives transcribed text from the server.
* `model-response`: Receives AI-generated text responses.
* `model-response-audio`: Receives AI-generated audio responses.
* `end-call`: Ends an ongoing call.
* `offer`, `answer`, `candidate`: used for webRTC signalling.

**3.2. Speech-to-Text Transcription**

* The application receives audio chunks from connected clients via WebSockets.
* These audio chunks are temporarily saved as WebM files.
* OpenAI Whisper is used to transcribe the audio into text.
* The transcribed text is then broadcasted to the receiver.

**3.3. Spam Detection and Response Generation**

* The application analyzes the transcribed text for potential spam patterns.
* If spam is detected, or after a specific elapsed time, GPT-4 is used to generate a conversational response.
* The system checks for key words like "win" and provides a direct response.
* Otherwise it sends the transcribed text to GPT-4 with a prompt to waste the callers time.
* Random fun lines are added to the GPT-4 response.
* The generated response is then converted to audio using OpenAI's TTS API.
* The audio response is sent back to the caller.

**3.4. Twilio Integration (Optional)**

* The application can integrate with Twilio to handle incoming calls.
* Twilio sends audio chunks to the `/twilio/call-handler` endpoint.
* `twilioController.js` handles these requests, transcribes the audio, and generates a TwiML response.

**3.5. Local Whisper (socket/index.js)**

* This part of the code is designed to use a local python script to transcribe audio using whisper.
* It converts mu-law audio to wav.
* It then spawns a python process to run the transcribe.py script.
* The result is then sent through the websocket.

**4. API Endpoints**

**4.1. WebSocket Events**

* Refer to section 3.1.

**4.2. HTTP API Routes**

* `GET /tts/:filename`: Serves TTS audio files from the `tts_responses` directory.
* `POST /twilio/call-handler`: Handles Twilio webhook requests for audio transcription.

**5. Installation and Setup**

**5.1. Prerequisites**

* Node.js (>= 16.x)
* npm or yarn
* Twilio Account (optional)
* OpenAI API Key
* Python 3.6+ (if using local whisper)
* ffmpeg (if using local whisper)
* Python libraries: whisper, wavefile.

**5.2. Installation Steps**

1.  **Clone the Repository:**

    ```bash
    git clone <[repository_url](https://github.com/NETBOTS-TECH/whisper-backend)>
    cd netbots-tech-whisper-backend
    ```

2.  **Install Dependencies:**

    ```bash
    npm install
    ```

3.  **Set Up Environment Variables:**

    Create a `.env` file in the root directory:

    ```
    OPENAI_API_KEY=your_openai_api_key
    PORT=3000
    ```

4.  **Install Python requirements (if using local whisper)**

    ```bash
    pip install whisper wavefile
    ```

5.  **Start the Server:**

    ```bash
    npm run dev
    ```

