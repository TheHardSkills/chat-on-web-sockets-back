//server
const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 5000 });

wss.on("connection", (ws) => {
  console.log("New client connected");

  ws.on("message", (data) => {
    console.log(`Client has sent us: ${data}`);

    ws.send(data.toUpperCase());
    // todo: record to db + send to client (reading data from the database)
  });

  ws.on("close", () => {
    console.log("Client has disconnected");
  });
});
