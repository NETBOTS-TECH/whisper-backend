import path from "path";
import OpenAI from "openai";
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });


export const postStream = (req, res) => {
  res.set("Content-Type", "text/xml");
  res.send(`
    <Response>
      <Start>
        <Stream name="Audio Stream" url="wss://${req.headers.host}" />
      </Start>
      <Say>The stream has started.</Say>
      <Pause length="30" />
    </Response>
  `);
};

export const getIndex = (req, res) => {
  res.sendFile(path.join(__dirname, "..", "index.html"));
};

export const handleIncomingSms = async (req, res) => {
  const messageBody = req.body.Body || "";
  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "Check if the user's message includes 'win' or 'scam'.",
        },
        { role: "user", content: `Message: "${messageBody}"` },
      ],
    });
    res.send(
      `OpenAI result: ${completion.data.choices[0].message?.content || ""}`
    );
  } catch (error) {
    res.status(500).send("Error using OpenAI");
  }
};