const mongoDbDataProcessing = require("./data-processing");
const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 5000 });

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
    //func with parse str and write to db
    writingClientMessageToDb(data);
    const allClientMessages = await findingClientMessageToDb(); // is a function needed for this primitive action?

    console.log("allClientMessages");
    console.log(allClientMessages);

    ws.send(data); // why in conlole??? - data is sent to the client
    // todo: record to db + send to client (reading data from the database)
  });

  ws.on("close", () => {
    console.log("Client has disconnected");
  });
});
