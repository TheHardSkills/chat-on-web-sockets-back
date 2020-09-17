const mongoDbDataProcessing = require("./data-processing");
const autorizationPart = require("./authorization-part");
const WebSocket = require("ws");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const urlencodedParser = bodyParser.urlencoded({ extended: false });

app.post("/login", urlencodedParser, function (request, response) {
  console.log("request**************");
  //let requestBodyInObj = JSON.parse(request.body)
  console.log(request.body);
  // let userInfo = {
  //   username: request.username,
  //   password: request.password,
  //   userToken: request.userToken,
  //   adminStatus: request.adminStatus,
  // };
  // todo: "userInfo" write to db + check enter data (validation)
  response.send("done");
});

app.listen(7000);

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
