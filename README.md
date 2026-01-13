# BeSafe - Online Safety Education gaming App for girls

An interactive educational application designed to teach girls how to handle online risks and protect themselves on the internet.

## 🎥 Demo Video

Watch our demo video to see the app in action:

[![BeSafe Demo](https://img.shields.io/badge/▶-Watch%20Demo%20Video-red?style=for-the-badge)](https://raw.githubusercontent.com/maiissh/Besafe-Hackathon/main/client/public/demo-video.mp4)

**Direct link:** [Watch Video](https://raw.githubusercontent.com/maiissh/Besafe-Hackathon/main/client/public/demo-video.mp4)

> **💡 Tip:** Right-click the link and select "Open in new tab" for best viewing experience. Some browsers may offer to download the video - in that case, right-click and "Save link as" to download and watch locally.

## 📋 Table of Contents

- [Demo Video](#-demo-video)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Features](#features)
- [Project Structure](#project-structure)
- [Troubleshooting](#troubleshooting)

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed:

1. **Node.js** - Version 20.x or higher
   - Download: [https://nodejs.org/](https://nodejs.org/)
   - Verify installation: `node --version`

2. **npm** - Usually installed with Node.js
   - Verify installation: `npm --version`
   - Update npm: `npm install -g npm@latest`

3. **MongoDB** - Database
   - Download: [https://www.mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
   - Or use MongoDB Atlas (cloud): [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)

**Note:** All other dependencies (OpenAI, franc, etc.) will be installed automatically when you run `npm install`. You don't need to install them separately.

## 📦 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Besafe-Hackathon
```

### 2. Install Server Dependencies

```bash
cd server
npm install
```

**Note:** If you encounter errors, make sure `eslint` and `nodemon` are installed:
```bash
npm install -D eslint nodemon
```

### 3. Install Client Dependencies

```bash
cd ../client
npm install
```

## ⚙️ Configuration

### Server Setup

1. Navigate to the `server` directory:
```bash
cd server
```

2. Create a `.env` file 
```bash
# Windows
copy .env.example .env

# Mac/Linux
cp .env.example .env
```

3. Open the `.env` file and fill in the following values:

```env
# MongoDB Connection
# For local MongoDB:
MONGODB_URI=mongodb://localhost:27017/besafe

# For MongoDB Atlas (cloud):
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/besafe

# Server Port
PORT=5000

# Client URL (Frontend URL)
CLIENT_URL=http://localhost:3000

# OpenAI API Key (Optional - for chat features)
# The app will work without this, but chat features will have limited functionality
OPENAI_API_KEY=your_openai_api_key_here
```

### Client Setup

1. Navigate to the `client` directory:
```bash
cd client
```

2. Create a `.env` file (if it doesn't exist):
```bash
# Windows
copy .env.example .env

# Mac/Linux
cp .env.example .env
```

3. Open the `.env` file and fill in the following values:

```env
# Server API URL
VITE_SERVER_API_URL=http://localhost:5000
```

## 🚀 Running the Application

### Correct Order to Run:

#### 1. Start MongoDB

**If using local MongoDB:**
- Make sure MongoDB is running on your machine
- Usually runs automatically after installation

**If using MongoDB Atlas:**
- No need to start anything, just ensure `MONGODB_URI` is correct in `.env` file

#### 2. Start the Server

Open a **new Terminal/PowerShell**:

```bash
cd server
npm run dev
```

You should see:
```
Server is running on port 5000
Socket.io server is ready
MongoDB Connected
```

#### 3. Start the Client

Open **another new Terminal/PowerShell**:

```bash
cd client
npm run dev
```

You should see:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:3000/
```

#### 4. Open the Application

Open your browser and navigate to:
```
http://localhost:3000
```

## ✨ Features

### 1. **Spot the Imposter Game** 🕵️
- Interactive game to teach children how to spot fake accounts
- Chat with AI-powered bots
- Voting system to identify the imposter

### 2. **Stories & Experiences** 📖
- Share stories and experiences
- Public stories visible to everyone
- Like system

### 3. **Serena Chat** 💬
- Intelligent chat assistant with AI
- Supports Arabic and English
- Online safety tips and advice

### 4. **Get Help** 🆘
- Request help in emergency situations
- Send help requests
- Notification system

### 5. **Levels & Points** 🎮
- Points and badges system
- Different levels
- Progress tracking

## 📁 Project Structure

```
Besafe-Hackathon/
├── client/                 # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── page/          # Application pages
│   │   ├── services/      # API services
│   │   └── styles/        # CSS files
│   ├── package.json
│   └── .env
│
├── server/                 # Backend (Node.js + Express)
│   ├── controllers/       # Business logic
│   ├── routes/            # API routes
│   ├── models/            # Database models
│   ├── data/              # Static data
│   ├── scripts/           # Helper scripts
│   ├── config/            # Database configuration
│   ├── server.js          # Server entry point
│   ├── package.json
│   └── .env
│
└── README.md
```

## 🔧 Troubleshooting

### Issue: Server won't start

**Solution:**
1. Make sure MongoDB is running
2. Check the `.env` file in the `server` directory
3. Ensure port 5000 is not in use:
   ```bash
   # Windows
   netstat -ano | findstr :5000
   
   # Mac/Linux
   lsof -i :5000
   ```

### Issue: Client won't start

**Solution:**
1. Check the `.env` file in the `client` directory
2. Make sure `VITE_SERVER_API_URL` is correct
3. Ensure port 3000 is not in use:
   ```bash
   # Windows
   netstat -ano | findstr :3000
   
   # Mac/Linux
   lsof -i :3000
   ```

### Issue: Chat not working

**Solution:**
1. The chat will work with basic functionality even without `OPENAI_API_KEY`
2. For full AI chat features, add `OPENAI_API_KEY` to server `.env` file (optional)
3. Check that the Server is running on the correct port
4. Open Browser Console (F12) to check for errors
5. Verify Socket.io connection:
   - Open Network tab in DevTools
   - Look for WebSocket connections

### Issue: Database connection failed

**Solution:**
1. Check `MONGODB_URI` in `.env` file
2. Make sure MongoDB is running:
   ```bash
   # Windows
   mongod --version
   
   # Mac/Linux
   mongod --version
   ```
3. If using MongoDB Atlas, make sure:
   - Your IP address is added to whitelist
   - Username and password are correct

### Issue: Stories not showing

**Solution:**
1. Run the seed stories script:
   ```bash
   cd server
   npm run seed-stories
   ```
2. Make sure stories are public:
   ```bash
   npm run make-stories-public
   ```

### Issue: ESLint Errors

**Solution:**
1. Run:
   ```bash
   npm run lint
   ```
2. Or ignore errors in scripts:
   - Errors in `scripts/` can be ignored

## 📝 Useful Scripts

### Server Scripts

```bash
# Add new stories
npm run seed-stories

# Make stories public
npm run make-stories-public

# Show all stories
npm run show-all-stories

# Delete a story
npm run delete-story

# Test stories API
npm run test-stories-api
```

## 🛑 Stopping the Application

- **Stop Server**: Press `Ctrl + C` in the server terminal
- **Stop Client**: Press `Ctrl + C` in the client terminal

## 📚 Additional Resources

- [React Documentation](https://react.dev/)
- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Socket.io Documentation](https://socket.io/docs/)
- [Vite Documentation](https://vitejs.dev/)


## 👥 About This Project

This project was developed by our team as part of the BeSafe Hackathon 2026. It is an educational gaming application designed specifically for girls to learn about online safety and protect themselves from digital risks.

**Team Members:**
- [@maiissh](https://github.com/maiissh)
- [@hebafarhan](https://github.com/hebafarhan)
- [@karenseh](https://github.com/karenseh)
- [@noranal](https://github.com/noranal)
- [@RaneemEassa](https://github.com/RaneemEassa)
- [@salmaj141](https://github.com/salmaj141)


*This project was created by our team for the BeSafe Hackathon 2026.*

## 📄 License

This project is part of BeSafe Hackathon 2026 

## 📧 Support

For help or inquiries:
- Open an Issue on GitHub
- Or email us at: queenb.community@gmail.com

---

**Happy Coding! 🚀**
