const PORT = 8000;
const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(cors());
app.use(express.json());
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.AI_KEY);
app.post("/gemini", async (req, res) => {
  // console.log(req.body.history)
  // console.log(req.body.message)
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  const chat = model.startChat({
    history: req.body.history,
  });
  const message = req.body.message;
  // const result = await chat.sendMessage(message);
  const result = await model.generateContentStream(message);
  const response = await result.response;
  let responseText = "";
  for await (const chunk of result.stream) {
    const chunkText = chunk.text();
    responseText += chunkText;
    // process.stdout.write(chunkText);
  }
  res.send(responseText );
  // const text = response.text();
  // res.send(text);
});

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
