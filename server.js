const mongoDbDataProcessing = require("./data-processing");
const WebSocket = require("ws");
const express = require("express");
const cors = require("cors");
const http = require("http");

const checkingIfSuchUserExists = async (userData) => {
  const dataProcessing = new mongoDbDataProcessing(); // todo: move to top (pass as parameter ?)
  const oneUserData = await dataProcessing.existingUserChecker(userData);

  if (oneUserData.loginResult.isAuthorized === true) {
    console.log("Chat demo ...");
  } else if (oneUserData.loginResult.isAuthorized === false) {
    console.log(
      "Error! This username already exists, or the password was entered incorrectly."
    );
    return;
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
  response.send(checkingResult.currentUserInDb);
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
app.get("/getOnlineUsers", async (request, response) => {
  // get all message from server, send to client 4 display

  const dataProcessing = new mongoDbDataProcessing(); // todo: move to top (pass as parameter ?)
  const onlineUsers = await dataProcessing.getUsersOnline();

  response.send(onlineUsers);
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
const findingAllUsersInDb = async () => {
  const dataProcessing = new mongoDbDataProcessing(); // todo: move to top (pass as parameter ?)
  const allUsersInChat = await dataProcessing.getAllUsers();
  let arrWithNameAllUsers = allUsersInChat.map((user) => {
    return user.username;
  });
  return arrWithNameAllUsers;
};

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

const whoOnline = async () => {
  const dataProcessing = new mongoDbDataProcessing(); // todo: move to top (pass as parameter ?)
  let onlineUsers = await dataProcessing.getUsersOnline();
  return onlineUsers;
};

const usernameParameterHandler = (usernameParameter) => {
  let splitArr = usernameParameter.split("=");
  return splitArr[1];
};

const port = 5000;
const server = http.createServer(express);
const socket = new WebSocket.Server({ server });

socket.on("connection", async function connection(
  connection,
  usernameParameter
) {
  const userName = usernameParameterHandler(usernameParameter.url);

  const dataProcessing = new mongoDbDataProcessing(); // todo: move to top (pass as parameter ?)
  await dataProcessing.updateOneOfTheUser(userName, true); //update admin status
  // let arrWithAllUsersName = await findingAllUsersInDb();
  let onlineUserInfo = await dataProcessing.getOneUserInfo(userName);
  //console.log("userInfo================", userInfo);

  let currClient;
  socket.clients.forEach(function each(client) {
    currClient = client;
    if (onlineUserInfo.onBan) {
      //разрыв сокет - соединения
      currClient.close();
    }
  });

  let onlineUsers = await whoOnline();

  //if admin - > в массив
  if (onlineUserInfo.adminStatus) {
    let dataForAdmin = { onlineUsers: [...onlineUsers] };
    console.log("ADMIN", await findingAllUsersInDb());
    dataForAdmin.allUsers = await findingAllUsersInDb();
    console.log("DATA 4 ADMIN", dataForAdmin);

    socket.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        if (client === connection) {
          client.send(JSON.stringify(dataForAdmin));
        } else {
          client.send(JSON.stringify([...onlineUsers]));
        }
      }
    });
  } else {
    // console.log("DATA 4 ALL", onlineUsers);
    socket.clients.forEach(function each(client) {
      if (client !== connection && client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify([...onlineUsers]));
      }
    });
  }

  console.log("*******connection**********");
  console.log("Joined the chat:  ", userName);

  connection.on("message", async function incoming(data) {
    let dataFromAdmin = JSON.parse(data);
    if (dataFromAdmin.command) {
      //значит данные от админа = изменить состояния юзеров
      if (dataFromAdmin.command === "onBan") {
        await dataProcessing.updateOneOfTheUserForAdnin(
          dataFromAdmin.username,
          { onBan: true }
        );
      }
      if (dataFromAdmin.command === "onMute") {
        await dataProcessing.updateOneOfTheUserForAdnin(
          dataFromAdmin.username,
          { onMute: true }
        );
      }
    } ////
    else {
      if (onlineUserInfo.onMute) {
        return;
      } else {
        writingClientMessageToDb(data);
        await findingClientMessageToDb();
        socket.clients.forEach(function each(client) {
          if (client !== connection && client.readyState === WebSocket.OPEN) {
            client.send(data);
          }
        });
      }
    } ///
  });

  connection.on("close", async function incoming(data) {
    console.log("STATUS:", data);
    await dataProcessing.updateOneOfTheUser(userName, false); //update admin status

    let onlineUsers = await whoOnline();

    console.log("disconnected++++++++++++");
    console.log(userName, "left the chat");
    socket.clients.forEach(function each(client) {
      if (client !== connection && client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(onlineUsers));
      }
    });
  });
});

server.listen(port, function () {
  console.log(`Server is listening on ${port}!`);
});
