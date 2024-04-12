import express from "express";
import { Server } from "socket.io";
import http from "http";

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const port = process.env.PORT || 5000;

const userSocketMap = {};
//usersocketmap -> holds all users with socketId as key and username as value
const getAllClientsInRoom = (roomId) => {
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
    (socketId) => {
      return {
        socketId,
        username: userSocketMap[socketId],
      };
    }
  );
};

io.on("connection", (socket) => {
  //whenever a new connection is created in server
  console.log(`user with id ${socket.id} connected`);

  //an event JOIN
  socket.on("join", ({ roomId, username }) => {
    //storing the client details locally in server
    userSocketMap[socket.id] = username;
    //creating the current socket in room
    socket.join(roomId);

    //getting all   the clientsin the current room
    const clients = getAllClientsInRoom(roomId);
    console.log(clients);

    //notifying each and every cleint in the room about the new connection
    clients.forEach(({ socketId }) => {
      //an event named JOINED
      io.to(socketId).emit("joined", {
        clients, //all the cleint details
        username, // sending the username
        socketId: socket.id, // sending the socket id
      });
    });
  });
  //notifying each and every client in the room that a user has left the room
  socket.on("disconnecting", () => {
    const rooms = [...socket.rooms];
    console.log("first");
    rooms.forEach((roomId) => {
      socket.in(roomId).emit("disconnected", {
        socketId: socket.id,
        username: userSocketMap[socket.id],
      });
    });
    delete userSocketMap[socket.id];
    socket.leave();
  });
});

server.listen(port, () => {
  console.log("server is running at port ", port);
});
