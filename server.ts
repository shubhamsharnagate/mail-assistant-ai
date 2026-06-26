import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API endpoint to generate emails
  app.post("/api/generate-email", async (req, res) => {
    try {
      const { emailType, recipientName, senderName, purpose, tone, additionalInfo } = req.body;

      if (!emailType || !recipientName || !purpose || !tone) {
        return res.status(400).json({ error: "Missing required fields: emailType, recipientName, purpose, tone" });
      }

      const key = process.env.GEMINI_API_KEY;
      if (!key) {
        return res.status(500).json({
          error: "Gemini API key is missing. Please set GEMINI_API_KEY in the Secrets panel."
        });
      }

      // Lazy initialize the SDK client
      const ai = new GoogleGenAI({
        apiKey: key,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          }
        }
      });

      const prompt = `Generate a highly tailored email subject and complete email body with professional formatting.
Details:
- Email Type / Context: ${emailType}
- Recipient Name: ${recipientName}
- Sender Name: ${senderName || "Anonymous / Not specified"}
- Main Purpose / Detail: ${purpose}
- Desired Tone: ${tone}
- Additional Details/Context: ${additionalInfo || "None"}

Requirements:
- Create an engaging, professional, and clear subject line.
- Write a complete and natural-sounding email body. 
- Avoid placeholder brackets like [Your Name] in the closing if the Sender Name (${senderName || "Anonymous"}) is provided; use it instead.
- If other details like specific dates or company names are needed but not provided, use clean placeholders (e.g., [Date], [Company Name]) or reasonable standard text.
- Match the specified tone: ${tone}.
  * Formal: Polished, standard business English, deferential.
  * Professional: Efficient, clean, proactive, polite.
  * Friendly: Warm, enthusiastic, collaborative, approachable.
  * Casual: Relaxed, conversational, direct but courteous.`;

      // Define models to try in order of preference
      const modelsToTry = ["gemini-3.5-flash", "gemini-2.5-flash", "gemini-2.5-flash-latest"];
      let response = null;
      let lastError = null;

      for (const modelName of modelsToTry) {
        try {
          response = await ai.models.generateContent({
            model: modelName,
            contents: prompt,
            config: {
              systemInstruction: "You are MailGenius, an expert professional email copywriter and editor. You craft beautifully written, highly effective, and grammatically flawless emails that get results.",
              temperature: 0.7,
              responseMimeType: "application/json",
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  subject: {
                    type: Type.STRING,
                    description: "The subject line of the email, concise and relevant."
                  },
                  body: {
                    type: Type.STRING,
                    description: "The complete, formatted body of the email, including salutation, body paragraphs, and professional sign-off/closing."
                  }
                },
                required: ["subject", "body"]
              }
            }
          });
          if (response && response.text) {
            console.log(`Successfully generated email using model: ${modelName}`);
            break; // Stop trying other models
          }
        } catch (err: any) {
          console.warn(`Model ${modelName} failed to generate content:`, err.message || err);
          lastError = err;
        }
      }

      if (!response || !response.text) {
        throw new Error(
          lastError?.message || 
          "Failed to generate content after trying multiple Gemini models."
        );
      }

      // Robust JSON cleaning to avoid parse errors if markdown blocks are returned
      let responseText = response.text.trim();
      if (responseText.startsWith("```")) {
        responseText = responseText.replace(/^```json\s*/i, "").replace(/```$/, "").trim();
      }

      const result = JSON.parse(responseText);
      return res.json({
        success: true,
        subject: result.subject,
        body: result.body
      });
    } catch (error: any) {
      console.error("Error generating email:", error);
      return res.status(500).json({
        error: error.message || "Failed to generate email due to an internal server error."
      });
    }
  });

  // Serve static assets / handle Vite in development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
