import fs from "fs";
import path, { join } from "path";
import { fileURLToPath } from "url";
import OpenAI from "openai";
import "dotenv/config";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// This controller assumes that Twilio sends a POST request with a JSON payload 
// containing a base64-encoded audio chunk 
export const postStream = async (req, res) => {
  try {
    // Expecting the audio data as a base64 string in req.body.audio
    const base64Audio = req.body.audio;

    console.log(base64Audio)
    if (!base64Audio) {
      return res.status(400).send("No audio data provided");
    }
    
    // Convert base64 to Buffer and save as temporary file (assume WebM/Opus)
    const audioBuffer = Buffer.from(base64Audio, "base64");
    const tempFilePath = join(__dirname, `temp-${Date.now()}.webm`);
    fs.writeFileSync(tempFilePath, audioBuffer);
    
    // Transcribe using OpenAI Whisper
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(tempFilePath),
      model: "whisper-1",
      language: "en"
    });
    
    // Remove the temporary file
    fs.unlinkSync(tempFilePath);
    
    // Build a TwiML response that speaks the transcript
    res.set("Content-Type", "text/xml");
    res.send(`
      <Response>
        <Say>${transcription.text}</Say>
      </Response>
    `);
  } catch (error) {
    console.error("Error transcribing Twilio audio:", error);
    res.status(500).send("Error processing audio");
  }
};

export const getIndex = (req, res) => {
  // Optionally serve an index.html file for testing
  res.sendFile(join(__dirname, "..", "index.html"));
};
