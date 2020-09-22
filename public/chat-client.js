const ws = new WebSocket("ws://localhost:5000/");
ws.addEventListener("open", () => {
  console.log("We are connected!");
});
ws.addEventListener("message", ({ data }) => {
  console.log("dataaaaa");
  console.log(data);
});

let currentUserName = localStorage.getItem("currentUserName");
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
