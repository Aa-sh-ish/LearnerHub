const { io } = require("socket.io-client");

const socket = io("http://localhost:8848");

socket.on("connect", () => {
  console.log("Connected with id:", socket.id);

  // Send a message
  socket.emit("send_message", { text: "Hello from Node client!" });
});

socket.on("receive_message", (data) => {
  console.log("Received message:", data);
});

socket.on("disconnect", () => {
  console.log("Disconnected");
});
