const mongoDbDataProcessing = require("./data-processing");
const autorizationPart = require("./authorization-part");
const WebSocket = require("ws");
const express = require("express");
const app = express();

app.post("/login", function (request, response) {
  let userInfo = {
    username: request.username,
    password: request.password,
  };
  // todo: "userInfo" write to db + check enter data (validation)
  response.send("done");
});

app.listen(3000);

///////////////////////////////////////////
//WebSocket logic:
///////////////////////////////////////////

const wss = new WebSocket.Server({ port: 5000 });

//call class from authorization-part
const autorization = new autorizationPart();
//autorization.writingUserDataToDb(data)

const writingClientMessageToDb = (dataInString) => {
  const objectWithClientData = JSON.parse(dataInString);
  const dataProcessing = new mongoDbDataProcessing(); // todo: move to top (pass as parameter ?)
  dataProcessing.messageCreator(objectWithClientData);
};

// is a function needed for this primitive action?
const findingClientMessageToDb = async () => {
  const dataProcessing = new mongoDbDataProcessing(); // todo: move to top (pass as parameter ?)
  const allClientMessages = await dataProcessing.messagesFounder();
  return allClientMessages;
};

wss.on("connection", (ws) => {
  console.log("New client connected");

  ws.on("message", async (data) => {
    console.log(`Client has sent us: ${data}`);
    writingClientMessageToDb(data); //func with parse str and write to db
    const allClientMessages = await findingClientMessageToDb(); // is a function needed for this primitive action?
    // console.log("allClientMessages");
    // console.log(allClientMessages);

    ws.send(data); // data is sent to the client - addEventListener("message")
    // todo: record to db + send to client (reading data from the database)
  });

  ws.on("close", () => {
    console.log("Client has disconnected");
  });
});
