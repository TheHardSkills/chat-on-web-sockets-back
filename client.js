//draft client logic
const ws = new WebSocket("ws://localhost:5000/");
ws.addEventListener("open", () => {
  console.log("We are connected!");
});
ws.addEventListener("message", ({ data }) => {
  console.log(data);
});

const mainConteiner = document.getElementById("mainConteiner");
const form = document.createElement("form");
const inputWithMessageFromClient = document.createElement("input");
const sendButton = document.createElement("input");

inputWithMessageFromClient.id = "inputWithMessageFromClient";

var buildingBlockWithMessages = () => {
  if (!document.getElementById("allMessageBlock")) {
    const allMessageBlock = document.createElement("div");
    allMessageBlock.id = "allMessageBlock";
    mainConteiner.append(allMessageBlock);
  }

  const correspondenceBlock = document.createElement("div");
  correspondenceBlock.id = "correspondenceBlock";

  allMessageBlock.append(correspondenceBlock);

  return correspondenceBlock;
};
const getData = (date) => {
  let dd = date.getDate();
  if (dd < 10) dd = "0" + dd;

  let mm = date.getMonth() + 1;
  if (mm < 10) mm = "0" + mm;

  let yy = date.getFullYear() % 100;
  if (yy < 10) yy = "0" + yy;

  // todo: hh and min include to returned object
  const hh = date.getHours();
  const min = date.getMinutes();

  return dd + "." + mm + "." + yy;
};

const messageInformationGenerator = (messageText) => {
  const currentDate = new Date();
  const messageData = getData(currentDate);

  let objectWithMessageInfo = {
    message: messageText,
    senderToken: 1,
    recipientToken: 2,
    departureTime: messageData,
  };

  return objectWithMessageInfo;
};

var sendDataFunc = () => {
  console.log("Data is here");
  let messageFromClient = document.getElementById("inputWithMessageFromClient")
    .value;
  const messageInfo = messageInformationGenerator(messageFromClient);

  console.log("messageInfo");
  console.log(messageInfo);

  // sending data to the server for writing to the db !
  ws.send(messageInfo); //todo: process the object in the format required for sending to the server
  let correspondenceBlock = buildingBlockWithMessages();
  correspondenceBlock.innerText = messageFromClient;
};

sendButton.value = "Send data to server";
sendButton.onclick = sendDataFunc;

mainConteiner.append(form);
form.append(inputWithMessageFromClient);
form.append(sendButton);
