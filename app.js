const express = require("express");
require("dotenv").config();
const cors = require("cors");

const port = process.env.PORT || 3000;

const app = express();
app.use(cors());
const cron = require("node-cron");

const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer, {
  cors: { origin: "*" },
});

let array = [];

io.use((socket, next) => {
  console.log(socket.handshake.auth); // This should print the auth object with userID
  socket.userID = socket.handshake.auth.userID;
  console.log(`User connected with userID ${socket.userID}`);
  next();
}).on("connection", (socket) => {
  console.log("A user has connected to the socket");
  const user = {
    userID: socket.userID,
    socketId: socket.id,
  };
  array.push(user);
  console.log(array);

  socket.on("disconnect", () => {
    console.log("A user disconnected");
    array = array.filter((u) => u.socketId !== socket.id);
    console.log(array);
  });
});

cron.schedule("0 9 * * 1-6", () => {
  const time = new Date();
  const currentTime = time.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const notification = {
    message: "Hey, just a friendly reminder to check in ignore if u already did",
    Time: currentTime,
  };


    io.emit("checkIn", notification);

});

cron.schedule("30 18 * * 1-6", () => {
    const time = new Date();
    const currentTime = time.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const notification = {
      message: "Hey, just a friendly reminder to check out ignore if u already did",
      Time: currentTime,
    };
  
      io.emit("checkOut", notification);
  });



httpServer.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
