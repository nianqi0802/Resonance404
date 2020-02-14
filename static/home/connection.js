class Connection {
    constructor(room, type, url) {
        const self = this;

        // Create socket
        self.socket = io(url, {
            query: {
                room: room,
                type: type
            }
        });

        // Expose handlers for basic connection events
        self.onConnect = handler => {
            self.socket.on("connect", handler);
        };

        self.onDisconnect = handler => {
            self.socket.on("disconnect", handler);
        };

        self.onError = handler => {
            self.socket.on("error", handler);
        };

        self.onOtherConnect = handler => {
            self.socket.on("__client_connected__", otherInfoArray =>
                otherInfoArray.forEach(info => handler(info.id, info.type))
            );
        };

        self.onOtherDisconnect = handler => {
            self.socket.on("__client_disconnected__", handler);
        };

        self.onOtherDisconnect = handler => {
            self.socket.on("__client_disconnected__", handler);
        };

        // Sending

        // Send to all other sockets in the same room as this socket
        self.send = (messageName, ...params) => {
            self.socket.emit(messageName, room, ...params);
        };

        // Send to sockets in the specified room (or individual socket if a socket Id is provided)
        self.sendTo = (messageName, roomOrSocket, ...params) => {
            self.socket.emit(messageName, roomOrSocket, ...params);
        };

        self.on = (messageName, handler) => {
            self.socket.on(messageName, handler);
        };

        self.update = (messageName, data) => {
            self.socket.on(messageName,
                // Run this function when a message is sent
                function(data) {


                    // Call "broadcast" to send it to all clients (except sender), this is equal to
                    // socket.broadcast.emit('message', data);
                    //socket.broadcast.send(data);

                    // To all clients, on io.sockets instead
                    self.sockets.emit(messageName, data);
                }
            );
        }

        self.close = () => {
            self.socket.close();
        };
    }

    get id() {
        return this.socket.id;
    }
}