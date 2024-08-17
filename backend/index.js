const express = require("express");
const { createServer } = require("http");
const { v4: uuidv4 } = require("uuid");
const { Server } = require("socket.io");
const cors = require("cors");
const mongoose = require('mongoose');
require('dotenv').config()
const {ipAddress_checker,ipAddress_inserter,ipAddress_updater} = require('./middleware')

const app = express();
const server = createServer(app);
const PORT = process.env.PORT

// mongodb connection
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

// Use cors middleware
// Add headers before the routes are defined
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // Allow all origins
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specific HTTP methods
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Allow specific headers

  if (req.method === 'OPTIONS') {
      return res.status(200).end();
  }

  next();
});

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
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"],
  },
});

// maintaing the state
const roomState = {};

let totalVotes = 0;

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("joinRoom", async({ roomId, pollData }) => {    
    // Initialize roomState if it doesn't exist or if it's undefined
    if (roomState[roomId] === undefined) {
      roomState[roomId] = pollData; // Initialize with pollData
      roomState[roomId].totalVotes = totalVotes;
    }
    // Join the room
    socket.join(roomId);
    // make an insertion into database
    // await ipAddress_inserter(roomId,ipAddress)

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

  socket.on("sendVote", async({ isSelected, roomId, ipAddress }) => {   
    // check if the ipAddress has already not voted or not
    const result = await ipAddress_checker(roomId,ipAddress)
    console.log('ipaddress: ',ipAddress);
    
    if(!result){
      socket.emit('multipleVotes');
      return ;
    }
    roomState[roomId].options.forEach((option) => {
      if (option.option === isSelected) {
        option.vote++;
      }
    });
    roomState[roomId].totalVotes++;

    // Emit the updated state to all clients in the room
    io.to(roomId).emit("updateState", roomState[roomId]);

    // update the ipAddress in the database
    await ipAddress_updater(roomId,ipAddress)
  });
});

app.post("/api/createpoll", async(req, res) => {
  // const { publicIpv4 } = await import("public-ip");
  const ipAddress = req.body.ipAddress
  console.log('/api/cretaepoll ip: ',ipAddress);
  
  const roomId = uuidv4();
  try {
    await ipAddress_inserter(roomId,ipAddress);
    res.send({
      message: "success",
      roomId,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating poll",
    })
  }
});

app.post("/api/joinRoom", async(req, res) => {
  // const { publicIpv4 } = await import("public-ip");
  const ipAddress = req.body.ipAddress
  try {
    await ipAddress_inserter(req.body.roomId,ipAddress)
    if (roomState[req.body.roomId]) {
      res.send("success");
    } else {
      res.send("error");
    }
  } catch (error) {
    res.status(500).json({
      message: "Error joining room",
      })
  }
});

server.listen(PORT, () => {
  console.log(`server listening on http://localhost:${PORT}`);
});
