const mongoDbDataProcessing = require("./data-processing");
const WebSocket = require("ws");
const express = require("express");
const cors = require("cors");

const checkingIfSuchUserExists = async (userData) => {
  const dataProcessing = new mongoDbDataProcessing(); // todo: move to top (pass as parameter ?)
  const oneUserData = await dataProcessing.existingUserChecker(userData);

  console.log("oneUserData");
  console.log(oneUserData);

  if (oneUserData.loginResult.isAuthorized === true) {
    console.log("Chat demo ...");
  } else if (oneUserData.loginResult.isAuthorized === false) {
    console.log(
      "Error! This username already exists, or the password was entered incorrectly."
    );
  } else {
    console.log(" New user was create ");
  }

  return oneUserData;
};

const app = express();

app.use(cors());
app.use(express.static("./public"));
app.use(express.urlencoded({ extended: true }));

app.post("/login", async (request, response) => {
  //на "/login" пришли данные,
  //сервер проверяет есть ли такие данные - нет - создает (checking if such user exists)

  let userInfoObject = badFunctionForHandlingInvalidObject(request.body);

  let userInfo = {
    username: userInfoObject.username,
    password: userInfoObject.password,
    adminStatus: userInfoObject.adminStatus,
  };

  let checkingResult = await checkingIfSuchUserExists(userInfo);
  // -console.log("checkingResult");
  // -console.log(checkingResult);

  response.send(checkingResult.currentUserInDb);

  // todo: "userInfo" write to db + check enter data (validation)
  //- const dataProcessing = new mongoDbDataProcessing(); // todo: move to top (pass as parameter ?)
  //- dataProcessing.userCreator(userInfo); // todo: .getUsersOnline()
  //--checkingIfSuchUserExists(userInfo);

  // todo: move to needed place
  const findingAllUsersInDb = async () => {
    const dataProcessing = new mongoDbDataProcessing(); // todo: move to top (pass as parameter ?)
    const allUsersInChat = await dataProcessing.getAllUsers();
    return allUsersInChat;
  };
});
var path = require("path");
app.get("/chat", async (request, response) => {
  //response.sendFile("/chat-page.html", { root: "./public" });
  response.sendFile(path.join(__dirname, "/public/chat-page.html"));
});
app.get("/getAllMessage", async (request, response) => {
  // get all message from server, send to client 4 display

  const dataProcessing = new mongoDbDataProcessing(); // todo: move to top (pass as parameter ?)
  const allMessages = await dataProcessing.messagesFounder();

  response.send(allMessages);
});

app.listen(7000);

var badFunctionForHandlingInvalidObject = (obj) => {
  let keysArray = Object.keys(obj);
  let resultObject = JSON.parse(keysArray);
  return resultObject;
};

/*
 * WebSocket logic:
 */

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
