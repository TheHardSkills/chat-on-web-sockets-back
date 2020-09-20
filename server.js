const mongoDbDataProcessing = require("./data-processing");
const autorizationPart = require("./authorization-part");
const WebSocket = require("ws");
const express = require("express");
const cors = require("cors");

//////start/
var checkingIfSuchUserExists = async (userData) => {
  console.log("userData***");
  console.log(userData);
  //get true / false /'user creator' message

  const dataProcessing = new mongoDbDataProcessing(); // todo: move to top (pass as parameter ?)
  const oneUserData = await dataProcessing.existingUserChecker(userData);
  console.log("oneUserData");
  console.log(oneUserData);
  if (oneUserData === true) {
    // такой юзер есть - лог и пар совпадают
    // => отрендерить сообщения
    console.log("chat demo");
  } else if (oneUserData === false) {
    // ошибка, логин есть, а пароль не совпадает
    // => вывести ошибку
    console.log("error!");
  } else {
    // сообщение о том, что юзер создан - такого логина в базе нет
    // => юзер записан в бд (мб это сделать тут, а не в data-processing)

    // показать ему пустой чат, или всю переписку до него ?
    // непринципиально = дать выбор юзеру - показать чат и или оставить его пустым до момента его появления в чате

    console.log("new user was create ");
  }
};

//////end/
const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.post("/login", function (request, response) {
  //на "/login" пришли данные,
  //сервер проверяет есть ли такие данные - нет - создает (checking if such user exists)

  let userInfoObject = badFunctionForHandlingInvalidObject(request.body);

  // console.log("userInfoObject");
  // console.log(userInfoObject);

  let userInfo = {
    username: userInfoObject.username,
    password: userInfoObject.password,
    userToken: userInfoObject.userToken,
    adminStatus: userInfoObject.adminStatus,
  };

  // todo: "userInfo" write to db + check enter data (validation)
  //- const dataProcessing = new mongoDbDataProcessing(); // todo: move to top (pass as parameter ?)
  //- dataProcessing.userCreator(userInfo); // todo: .getUsersOnline()
  //--checkingIfSuchUserExists(userInfo);

  // todo: move to needed place
  const findingAllUsersInDb = async () => {
    const dataProcessing = new mongoDbDataProcessing(); // todo: move to top (pass as parameter ?)
    const allUsersInChat = await dataProcessing.getAllUsers();
    // console.log("allUsersInChat");
    // console.log(allUsersInChat);
    return allUsersInChat;
  };
  findingAllUsersInDb();

  // todo: move to needed place
  const findUser = async () => {
    const dataProcessing = new mongoDbDataProcessing(); // todo: move to top (pass as parameter ?)
    const oneUserData = await dataProcessing.getOneUserInfo("Julia");// todo: dynamic name
    console.log("oneUserData");
    console.log(oneUserData);
    return oneUserData;
  };
  findUser();

  response.send("done");
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

//call class from authorization-part:
const autorization = new autorizationPart();
//autorization.writingUserDataToDb(data);

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
