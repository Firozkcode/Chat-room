// server.js
const express = require("express");
const path = require("path");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

// Serve public folder
app.use(express.static(path.join(__dirname, "public")));

// Serve scripts securely
app.get("/script/admin.js", (req, res) => {
    res.sendFile(path.join(__dirname, "script/admin.js"));
});
app.get("/script/user.js", (req, res) => {
    res.sendFile(path.join(__dirname, "script/user.js"));
});

io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("set-room", (roomKey) => {
        io.emit("room-changed", { type: "connect", message: "Admin has changed the chatroom ID. Please rejoin." });
    });

    // Notify users when someone joins
    socket.on("join-room", ({ name, key }) => {
        socket.join(key);
        
        // Grant access to the user
        socket.emit("access-granted");
    
        io.to(key).emit("message", {
            sender: "System",
            senderId: null,
            message: `${name} joined the chat`,
            type: "connect"
        });
    });
    socket.on("user-message", ({ message, sender, roomKey }) => {
        io.to(roomKey).emit("message", {
            sender,
            senderId: socket.id,
            message,
            type: "message"
        });
    });

    // Notify users when someone leaves
    socket.on("leave-room", ({ name, roomKey }) => {
        io.to(roomKey).emit("message", {
            sender: "System",
            senderId: null,
            message: `${name} left the chat`,
            type: "disconnect"
        });
    });

    socket.on("disconnect", () => {
        console.log("A user disconnected");
    });
});

http.listen(3000, () => console.log("Server running on http://localhost:3000"));
