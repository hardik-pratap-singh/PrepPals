const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

const connectDB = require("./config/db");
const errorHandler = require("./middleware/error");

const app = express();
app.use(express.json());
connectDB(); // Connect to databse

// API Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/private", require("./routes/private"));

// --------------------------DEPLOYMENT------------------------------

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "./client/build")));

  app.get("*", (req, res) => {
    return res.sendFile(
      path.resolve(__dirname, "client", "build", "index.html")
    );
  });
} else {
  app.get("/", (req, res) => {
    res.send("API is running");
  });
}

// --------------------------DEPLOYMENT------------------------------

// Error Handler Middleware (Should be at the end of all middlewares)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () =>
  console.log(`Server running on PORT ${PORT}`)
);

// Handling server errors with clean error messages
process.on("unhandledRejection", (err, promise) => {
  console.log(`Logged Error: ${err.message}`);
  server.close(() => process.exit(1));
});

//Socket

let roomsIdList = [];

const io = require("socket.io")(server,{
  pingTimeout: 60000,
  cors:{
    origin:'http://localhost:3000'
  }
});

const emailToSocketIdMap = new Map();
const socketidToEmailMap = new Map();

io.on("connection", (socket) => {
  console.log(`Socket Connected`, socket.id);
  socket.on("room:join", (data) => {
    const { email, room } = data;
    emailToSocketIdMap.set(email, socket.id);
    socketidToEmailMap.set(socket.id, email);
    roomsIdList = data.roomsList;
    console.log(roomsIdList);
    io.to(room).emit("user:joined", { email, id: socket.id });
    socket.join(room);
    io.to(socket.id).emit("room:join", data);
  });

  socket.on("user:call", ({ to, offer }) => {
    io.to(to).emit("incomming:call", { from: socket.id, offer });
  });

  socket.on("call:accepted", ({ to, ans }) => {
    io.to(to).emit("call:accepted", { from: socket.id, ans });
  });

  socket.on("peer:nego:needed", ({ to, offer }) => {
    console.log("peer:nego:needed", offer);
    io.to(to).emit("peer:nego:needed", { from: socket.id, offer });
  });

  socket.on("peer:nego:done", ({ to, ans }) => {
    console.log("peer:nego:done", ans);
    io.to(to).emit("peer:nego:final", { from: socket.id, ans });
  });

  socket.on("get:rooms", (to) => {
    console.log("get:rooms", to);
    io.to(to).emit("send:rooms", { from: socket.id, roomsIdList:roomsIdList });
  });
});

