//Create web server
const express = require("express");
const app = express();

//Create server
const http = require("http");
const server = http.createServer(app);

//Create socket
const socketio = require("socket.io");
const io = socketio(server);

//Import path module
const path = require("path");

//Import moment module
const moment = require("moment");

//Import formatMessage module
const formatMessage = require("./utils/messages");

//Import users module
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require("./utils/users");

//Set static folder
app.use(express.static(path.join(__dirname, "public")));

//Run when client connects
io.on("connection", (socket) => {
  //Join room
  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);

    //Join user to room
    socket.join(user.room);

    //Welcome current user
    socket.emit("message", formatMessage("Admin", "Welcome to ChatApp!"));

    //Broadcast when a user connects
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage("Admin", `${user.username} has joined to chat`)
      );

    //Send users and room info
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });

    //Listen for chat message
    socket.on("chatMessage", (msg) => {
      const user = getCurrentUser(socket.id);
      io.to(user.room).emit("message", formatMessage(user.username, msg));
    });

    //Runs when client disconnects
    socket.on("disconnect", () => {
      const user = userLeave(socket.id);
      if (user) {
        //Broadcast when a user disconnects
        io.to(user.room).emit(
          "message",
          formatMessage("Admin", `${user.username} has left the chat`)
        );

        //Send users and room info
        io.to(user.room).emit("roomUsers", {
          room: user.room,
          users: getRoomUsers(user.room),
        });
      }
    });
  });
});

//Set port
const PORT = process.env.PORT || 3000;

//Run server
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

