const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const executeRoute = require("./routes/execute");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", executeRoute);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  // console.log("User connected:", socket.id);

  socket.on("join-room", ({ roomId, username }) => {
    socket.join(roomId);

    socket.roomId = roomId;
    socket.username = username;

    // console.log(`${username} joined room ${roomId}`);
  });

  socket.on("code-change", ({ roomId, code }) => {
    socket.to(roomId).emit("code-update", code);
  });

  socket.on("cursor-move", ({ roomId, username, position }) => {
    // DEBUG
    // console.log("Cursor move:", username, position);

    socket.to(roomId).emit("cursor-update", {
      userId: socket.id,
      username,
      position,
    });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);

    if (socket.roomId) {
      socket.to(socket.roomId).emit("user-left", socket.id);
    }
  });
});

server.listen(5000, () => {
  console.log("Server running on port 5000");
});
