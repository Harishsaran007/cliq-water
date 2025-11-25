🌊 Cliq Live Water Bot
Real-Time Tamil Nadu Dam Water Level Fetching API (Node.js + Express + Cheerio)

This project provides real-time dam water level data by scraping official sources and exposing them through a clean API.
It is designed to integrate seamlessly with Zoho Cliq Bots, making it easy to fetch dam information via chat commands.

🚀 Features

🔍 Fetch dam water levels in real-time

⚡ Web scraping using Cheerio

🔐 Authorization middleware for secure access

🧩 REST API using Express.js

📡 MongoDB connected (optional for future storage)

🧰 Simple GET endpoint for Postman testing

🤖 Designed to integrate with Zoho Cliq Bots

🛠️ Tech Stack
Node.js
Express.js
Cheerio (Web Scraping)
Axios
MongoDB + Mongoose
Zoho Cliq Bot API Ready
dotenv (Environment variables)

🧠 How It Works

Scraper fetches live dam data from tnagriculture.in

Cheerio parses the HTML table

Backend filters the specific dam by name

API returns formatted JSON output

Zoho Cliq bot can display this data to users

🔐 Security

The API is protected using a simple header token (Authorization)

.env file is ignored using .gitignore

No private keys or credentials are exposed in the repository

👨‍💻 Author

Harishsaran S
MERN + AI Developer
Zoho Cliq Bot Developer
GitHub: https://github.com/Harishsaran007