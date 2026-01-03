# BeSafe Backend API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication

### Sign Up
**POST** `/api/students/signup`

Request body:
```json
{
  "full_name": "John Doe",
  "username": "johndoe",
  "email": "john@example.com",  // Optional if phone provided
  "phone": "0501234567",         // Optional if email provided
  "password": "password123",
  "grade_level": "middle",       // or "high"
  "region": "Center",            // Optional
  "school_name": "Test School",  // Optional
  "id_number": "123456789"       // Optional
}
```

Response:
```json
{
  "success": true,
  "message": "Account created successfully",
  "data": {
    "student": {
      "id": 1,
      "username": "johndoe",
      "full_name": "John Doe",
      "email": "john@example.com",
      "points": 0,
      "streak": 0,
      "currentLevel": 1,
      "completedLevels": 0
    },
    "token": "jwt-token-here"
  }
}
```

### Sign In
**POST** `/api/students/signin`

Request body:
```json
{
  "emailOrPhone": "john@example.com",  // or phone number
  "password": "password123"
}
```

Response:
```json
{
  "success": true,
  "message": "Sign in successful",
  "data": {
    "student": {
      "id": 1,
      "username": "johndoe",
      "full_name": "John Doe",
      "points": 120,
      "streak": 5,
      "currentLevel": 2
    },
    "token": "jwt-token-here"
  }
}
```

## Student Management

### Get Student by ID
**GET** `/api/students/:id`

Response:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "username": "johndoe",
    "full_name": "John Doe",
    "points": 120,
    "streak": 5,
    "currentLevel": 2
  }
}
```

### Update Student Profile
**PUT** `/api/students/:id`

Request body (all fields optional):
```json
{
  "full_name": "John Updated",
  "email": "newemail@example.com",
  "region": "North"
}
```

### Update Student Progress
**PATCH** `/api/students/:id/progress`

Request body:
```json
{
  "points": 150,
  "streak": 6,
  "currentLevel": 3,
  "completedLevels": 2
}
```

### Delete Student
**DELETE** `/api/students/:id`

## Game Rooms

### Create Room
**POST** `/api/game/rooms`

Request body:
```json
{
  "roomName": "My Game Room",
  "createdBy": "user-id-optional"
}
```

Response:
```json
{
  "success": true,
  "message": "Room created successfully",
  "data": {
    "roomId": "ROOM-1234",
    "roomName": "My Game Room",
    "shareUrl": "http://localhost:3000/join/ROOM-1234"
  }
}
```

### Get Room
**GET** `/api/game/rooms/:roomId`

### Join Room
**POST** `/api/game/rooms/:roomId/join`

Request body:
```json
{
  "playerId": "player-id",
  "playerName": "Player Name"
}
```

### Leave Room
**POST** `/api/game/rooms/:roomId/leave`

Request body:
```json
{
  "playerId": "player-id"
}
```

### Get All Rooms
**GET** `/api/game/rooms`

### Delete Room
**DELETE** `/api/game/rooms/:roomId`

## Levels

### Get All Levels
**GET** `/api/levels`

Response:
```json
{
  "success": true,
  "data": [
    {
      "level_number": 1,
      "title": "Cyberbullying Basics",
      "subtitle": "Learn the fundamentals of online safety",
      "color": "#F6C1D1",
      "unlocked": true,
      "requiredPoints": 0
    }
  ]
}
```

### Get Level by Number
**GET** `/api/levels/:levelNumber`

### Check Level Unlock Status
**GET** `/api/levels/:levelNumber/unlock?studentPoints=50`

## Socket.io Events

### Client → Server Events

- `join-room`: Join a game room
  ```javascript
  socket.emit('join-room', { roomId, playerId, playerName });
  ```

- `leave-room`: Leave a game room
  ```javascript
  socket.emit('leave-room', { roomId, playerId });
  ```

- `send-message`: Send a chat message
  ```javascript
  socket.emit('send-message', { roomId, message, sender, senderId });
  ```

- `start-game`: Start the game
  ```javascript
  socket.emit('start-game', { roomId, topic });
  ```

- `end-game`: End the game
  ```javascript
  socket.emit('end-game', { roomId });
  ```

- `get-room-info`: Get room information
  ```javascript
  socket.emit('get-room-info', { roomId });
  ```

### Server → Client Events

- `room-joined`: Confirmation of joining a room
- `room-left`: Confirmation of leaving a room
- `room-updated`: Room state has been updated
- `player-joined`: A new player joined the room
- `player-left`: A player left the room
- `new-message`: A new chat message
- `game-started`: Game has started
- `game-ended`: Game has ended
- `room-info`: Room information response
- `error`: Error message

## Health Check

**GET** `/api/health`

Response:
```json
{
  "success": true,
  "message": "Server is running"
}
```

