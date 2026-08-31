import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Google Gen AI client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.get("/", async (req, res) => {
  res.status(200).send({
    message: "This is ChatGPT / Gemini AI App",
  });
});

app.post("/", async (req, res) => {
  try {
    // 1. Updated model string to a current active flash model
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash", // Use active model name (e.g. gemini-2.5-flash)
      contents: req.body.input,
    });

    console.log("PASSED : ", req.body.input);

    // 2. Extract response text
    res.status(200).send({
      bot: response.text,
    });

  } catch (err) {
    console.log("FAILED : ", req.body.input);
    console.error(err);
    res.status(500).send({ error: err.message || "Something went wrong" });
  }
});

app.listen(4000, () => console.log("Server is running on port 4000"));