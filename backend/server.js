const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const app = express();
const userRoute = require("./route/userRoute");
const chatRoute = require("./route/chatRoute");
const messageRoute = require("./route/messageRoute");
const path = require("path");

dotenv.config();

app.use(cors());
app.use(express.json({ limit: "10mb" }));

connectDB();

app.use("/api/user", userRoute);
app.use("/api/chats", chatRoute);
app.use("/api/message", messageRoute);

// --------------------------deployment------------------------------

const __dirname1 = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "/frontend/build")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running..");
  });
}

// --------------------------deployment------------------------------

const server = app.listen(
  process.env.PORT || 5000,
  console.log(`server is running on port ${process.env.PORT} `)
);
const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  // console.log("connected to socket.io");

  socket.on("setUp", (userData) => {
    socket.join(userData.id);
    socket.emit("connected");
  });
  socket.on("joinChat", (room) => {
    socket.join(room);
  });

  socket.on("new", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;
    if (!chat.users) return;
    chat.users.forEach((user) => {
      if (user._id === newMessageRecieved.sender._id) return;

      socket.in(user._id).emit("newGet", newMessageRecieved);
    });
  });
  socket.off("setup", () => {
    // console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});
