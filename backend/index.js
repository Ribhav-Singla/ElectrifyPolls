const express = require("express");
const { createServer } = require("http");
const { v4: uuidv4 } = require("uuid");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = createServer(app);

// Use cors middleware
app.use(cors());

// Parse incoming requests with JSON payloads
app.use(express.json());

// Parse incoming requests with URL-encoded payloads
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("home route");
});

// Create a namespace for WebSocket connection
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// maintaing the state
const roomState = {};

let totalVotes = 0;

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("joinRoom", ({ roomId, pollData }) => {
    // Initialize roomState if it doesn't exist or if it's undefined
    if (roomState[roomId] === undefined) {
      roomState[roomId] = pollData; // Initialize with pollData
      roomState[roomId].totalVotes = totalVotes;
    }
    // Join the room
    socket.join(roomId);

    // print the list of all the users in the room
    const clientsInRoom = io.sockets.adapter.rooms.get(roomId);
    if (clientsInRoom) {
      console.log("Clients in room:", [...clientsInRoom]);
    } else {
      console.log("No clients in room yet.");
    }
  });

  socket.on("getState", (roomId) => {
    // Send the current state of the room to the new user
    socket.emit("updateState", roomState[roomId]);
  });

  socket.on("sendVote", ({ isSelected, roomId }) => {
    roomState[roomId].options.forEach((option) => {
      if (option.option === isSelected) {
        option.vote++;
      }
    });
    roomState[roomId].totalVotes++;

    // Emit the updated state to all clients in the room
    io.to(roomId).emit("updateState", roomState[roomId]);
  });
});

app.post("/api/createpoll", (req, res) => {
  const roomId = uuidv4();
  res.send({
    message: "success",
    roomId,
  });
});

app.post("/api/joinRoom", (req, res) => {
  if (roomState[req.body.roomId]) {
    res.send("success");
  } else {
    res.send("error");
  }
});

server.listen(8080, () => {
  console.log(`server listening on http://localhost:8080`);
});
