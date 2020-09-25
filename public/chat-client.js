const currentUserName = localStorage.getItem("currentUserName");
const ws = new WebSocket(`ws://localhost:5000/?user=${currentUserName}`);
ws.addEventListener("open", () => {
  console.log("We are connected!");
});
ws.addEventListener("message", ({ data }) => {
  console.log("dataaaaa");
  console.log(data);

  let dataInObj = JSON.parse(data);
  if(dataInObj.adminStatus){
    //отстроить другие возможности 
  }
  else if (dataInObj.message) {
    const chatModule = new ChatModule(currentUserName);
    chatModule.buildingBlockWithMessagesNewLogic(dataInObj);
    console.log("if");
  } else {
    console.log("else");
    let arrayWithOnlineUserData = JSON.parse(data);

    //вызвать ф-цию, которая отстраивает список из массива в блок с онлайн юзерами
    showUsersOnline.onlineUsersListBuilder(arrayWithOnlineUserData);
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

const getAllOnlineUsersFromServer = async () => {
  let response = await fetch("http://localhost:7000/getOnlineUsers");
  let onlineUsers = await response.json();
  console.log(onlineUsers);
  return onlineUsers;
};

const onlineUsersBlockBuilder = async () => {
  const allOnlineUsers = await getAllOnlineUsersFromServer(); //<--------
  showUsersOnline.onlineUsersListBuilder(allOnlineUsers);
};
onlineUsersBlockBuilder(); //не могу ожидать за асинхронной ф-цией

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

var showUsersOnline = new ShowUsersOnline();
showUsersOnline.buildingBlockWithOnlineUsers();
