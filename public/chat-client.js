const currentUserName = localStorage.getItem("currentUserName");
const ws = new WebSocket(`ws://localhost:5000/?user=${currentUserName}`);
ws.addEventListener("open", () => {
  console.log("We are connected!");
});
ws.addEventListener("message", ({ data }) => {
  console.log("dataaaaa");
  console.log(data);

  let dataInObj = JSON.parse(data);

  if (dataInObj.message) {
    const chatModule = new ChatModule(currentUserName);
    chatModule.buildingBlockWithMessagesNewLogic(dataInObj);
    console.log("if");
  } else {
    console.log("else");
    let arrayWithOnlineUserData = JSON.parse(data);
  }
});
ws.addEventListener("close", (event) => {
  console.log(event, " disconnected!");
});

console.log("currentUserName");
console.log(currentUserName);

const getAllMessagesFromServer = async () => {
  let response = await fetch("http://localhost:7000/getAllMessage");
  let allMessages = await response.json();
  console.log(allMessages);
  return allMessages;
};

const messageBlockBuilder = async () => {
  //build blocks with messages
  const allMessages = await getAllMessagesFromServer();

  const chatModule = new ChatModule(currentUserName);
  //цикл по созданию блока с сообщением - под все сбщ
  for (let i = 0; i < allMessages.length; i++) {
    let informationOfOneMessage = allMessages[i];
    chatModule.buildingBlockWithMessagesNewLogic(informationOfOneMessage);
  }
};
messageBlockBuilder();

const chatModule = new ChatModule(currentUserName);
chatModule.messageFormBuilder(ws);

const showUsersOnline = new ShowUsersOnline();
showUsersOnline.buildingBlockWithOnlineUsers();
