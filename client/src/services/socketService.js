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
}

export default new SocketService();