# BeSafe
## Online Safety Education Gaming App for Girls

BeSafe is an interactive educational web application designed to help girls learn how to recognize and handle online risks through gameplay and real-life simulations, not lectures.

The focus is on awareness, pattern recognition, and safe decision-making in digital environments.

## 🎥 Demo Video

Watch our demo video to see the app in action:

[![BeSafe Demo Video](https://img.shields.io/badge/▶-Watch%20Demo%20Video-1ab7ea?style=for-the-badge&logo=vimeo)](https://vimeo.com/1154050776)

## 🧠 ABOUT THE PROJECT

Many girls face online risks such as manipulation, pressure, harassment, and privacy violations.
Most awareness programs stay theoretical and do not prepare them for real situations.

BeSafe allows girls to practice identifying risky behavior in safe, simulated environments that reflect real online conversations.

## 🎮 MAIN FEATURES
### 🕵️ Spot the Imposter

Spot the Imposter is an interactive chat-based game designed to train girls and teens to recognize unsafe and manipulative behavior in online conversations.

The game simulates a realistic group chat around a normal daily topic. All participants appear trustworthy. One participant is secretly assigned as the Imposter.

The Imposter blends into the conversation while subtly using harmful tactics such as social pressure, emotional manipulation, normalization of harassment, boundary crossing, or privacy violations. The behavior appears gradually, similar to real online interactions.

Players are not warned about a specific message. The focus stays on patterns across the conversation, not single actions.

During the game, players:
Read the conversation carefully
Notice tone shifts and repeated phrases
Identify messages that feel uncomfortable or unsafe
Detect behavioral patterns rather than isolated messages
At the end of the chat phase, players vote on:
Who they believe the Imposter is
Which messages contained harmful or manipulative tactics
After voting, the game reveals:
The identity of the Imposter
An explanation of the risky patterns used
Why these patterns are dangerous in real online interactions

The goal is awareness, not winning.
Players learn to recognize risks early and react safely in real life.

### 📖 Stories

Share personal experiences
Browse public stories
Like system

### 💬 Serena Chat

Safety-focused chat assistant
Arabic and English support
Awareness tips and guidance

### 🆘 Get Help

Request help in urgent situations
Send alerts
Notification system

### 🏆 Levels and Points

Levels and badges
Progress tracking

## 🛠️ TECH STACK
### Frontend
React
Vite
JSX
CSS

### Backend
Node.js
Express
Databas
MongoDB
Realtime
Socket.io
Optional
OpenAI API for enhanced chat features

## 📁 PROJECT STRUCTURE

Besafe-Hackathon
client — frontend
server — backend
README.md

## 🚀 RUN LOCALLY
### REQUIREMENTS

Node.js 20 or higher
npm
MongoDB local or MongoDB Atlas

### INSTALLATION

Clone the repository
git clone <repository-url>
cd Besafe-Hackathon

Install server dependencies
cd server
npm install

Install client dependencies
cd ../client
npm install

## ⚙️ ENVIRONMENT VARIABLES
Server — server/.env

MONGODB_URI=mongodb://localhost:27017/besafe
PORT=5000
CLIENT_URL=http://localhost:3000

OPENAI_API_KEY=optional

Client — client/.env
VITE_SERVER_API_URL=http://localhost:5000

## ▶️ RUN THE APP

Start MongoDB

Start the server
cd server
npm run dev

Start the client
cd client
npm run dev

Open in browser
http://localhost:3000

## 🧪 COMMON ISSUES

Server not starting — MongoDB running, env correct, port 5000
Client not starting — env correct, port 3000
Chat limited — missing OpenAI key

## 👥 TEAM

@maiissh

@hebafarhan

@karenseh

@noranal

@RaneemEassa

@salmaj141

## 📄 LICENSE

BeSafe Hackathon 2026