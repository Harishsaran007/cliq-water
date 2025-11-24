const express = require("express");
const axios = require("axios"); // later for real dam data

const app = express();
app.use(express.json()); // so we can read JSON body

// This is the URL Zoho Cliq will call
app.post("/cliq/webhook", async (req, res) => {
  console.log("Incoming from Cliq:", JSON.stringify(req.body, null, 2));

  // 1. Read the text the user typed (e.g. "Mettur")
  const userText = req.body?.text || "";
  const damName = userText.trim() || "Unknown Dam";

  // 2. (For now) fake water level
  const level = "85%";
  const message = `🌊 Water status for *${damName}*: ${level} full (demo data).`;

  // 3. Zoho sends a response_url where we must POST the reply
  const responseUrl = req.body?.response_url;

  if (responseUrl) {
    try {
      await axios.post(responseUrl, {
        output: { text: message },
      });
    } catch (err) {
      console.error("Error posting to Cliq:", err.message);
    }
  }

  // 4. Always respond 200 OK to Zoho
  res.status(200).send("OK");
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});