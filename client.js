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

var sendDataFunc = () => {
  console.log("Data is here");
  let dataFromClient = document.getElementById("inputWithMessageFromClient")
    .value;
  ws.send(dataFromClient); //sending data to the server for writing to the db
  let correspondenceBlock = buildingBlockWithMessages();
  correspondenceBlock.innerText = dataFromClient;
};

sendButton.value = "Send data to server";
sendButton.onclick = sendDataFunc;

mainConteiner.append(form);
form.append(inputWithMessageFromClient);
form.append(sendButton);
