import fs from "fs";
import path from "path";
import OpenAI from "openai";
import 'dotenv/config'

const openai = new OpenAI({
    apiKey: "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"
});
const speechFile = path.resolve("./speech.mp3");

const mp3 = await openai.audio.speech.create({
    model: "tts-1",
    voice: "alloy",
    input: "",
});

const buffer = Buffer.from(await mp3.arrayBuffer());
await fs.promises.writeFile(speechFile, buffer);