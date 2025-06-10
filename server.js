const express = require("express");
const path = require("path");
const socket = require("socket.io");

const messages = [];
const users = [];

const app = express();

app.use(express.static(path.join(__dirname, "/client")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/client/index.html"));
});

const server = app.listen(process.env.PORT || 8000, () => {
  console.log("Server is running on port: 8000");
});

const io = socket(server);

io.on("connection", (socket) => {
  socket.on("user", (user) => {
    users.push(user);
    socket.on("disconnect", () => {
      const id = users.findIndex((u) => u.id === socket.id);
      if (id !== -1) {
        const userName = users[id].user;
        socket.broadcast.emit("message", {
          author: "ChatBot",
          content: `<i>${userName} has left the conversation... :(</i>`,
        });
        users.splice(id, 1);
      }
    });
  });
  socket.on("message", (message) => {
    messages.push(message);
    socket.broadcast.emit("message", message);
  });
});
