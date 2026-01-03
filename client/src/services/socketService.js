import io from 'socket.io-client';

// Use the environment variable defined in the client .env file
const SOCKET_URL = import.meta.env.VITE_SERVER_API_URL || 'http://localhost:5000';

class SocketService {
    socket = null;

    connect() {
        if (!this.socket) {
            this.socket = io(SOCKET_URL);
            console.log('Socket connecting...');
        }
        return this.socket;
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }

    // Wrapper to emit events easily
    emit(eventName, data) {
        if (this.socket) {
            this.socket.emit(eventName, data);
        }
    }

    // Wrapper to listen to events
    on(eventName, callback) {
        if (this.socket) {
            this.socket.on(eventName, callback);
        }
    }

    // Remove event listener
    off(eventName, callback) {
        if (this.socket) {
            this.socket.off(eventName, callback);
        }
    }

    // Join a game room
    joinRoom(roomId, playerId = null, playerName = null) {
        if (!this.socket) {
            this.connect();
        }
        this.emit('join-room', { roomId, playerId, playerName });
    }

    // Leave a game room
    leaveRoom(roomId, playerId = null) {
        if (this.socket) {
            this.emit('leave-room', { roomId, playerId });
        }
    }

    // Send a chat message
    sendMessage(roomId, message, sender = null, senderId = null) {
        if (this.socket) {
            this.emit('send-message', { roomId, message, sender, senderId });
        }
    }

    // Start a game
    startGame(roomId, topic = null) {
        if (this.socket) {
            this.emit('start-game', { roomId, topic });
        }
    }

    // End a game
    endGame(roomId) {
        if (this.socket) {
            this.emit('end-game', { roomId });
        }
    }

    // Get room information
    getRoomInfo(roomId) {
        if (this.socket) {
            this.emit('get-room-info', { roomId });
        }
    }
}

export default new SocketService();