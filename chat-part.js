class ChatModule {
  constructor(currentUserName) {
    this.currentUserName = currentUserName;
  }
  messageFormBuilder(ws) {
    const mainConteiner = document.getElementById("mainConteiner");
    const form = document.createElement("form");
    form.id = "formForMessageCreate";
    const inputWithMessageFromClient = document.createElement("input");
    const sendButton = document.createElement("input");
    inputWithMessageFromClient.id = "inputWithMessageFromClient";
    sendButton.value = "Send message";
    sendButton.className = "button";
    sendButton.onclick = () => {
      this.sendDataFunc(ws);
    };
    mainConteiner.append(form);
    form.append(inputWithMessageFromClient);
    form.append(sendButton);
  }

  getData(date) {
    let dd = date.getDate();
    if (dd < 10) dd = "0" + dd;

    let mm = date.getMonth() + 1;
    if (mm < 10) mm = "0" + mm;

    let yy = date.getFullYear() % 100;
    if (yy < 10) yy = "0" + yy;

    const hh = date.getHours();
    const min = date.getMinutes();

    return dd + "." + mm + "." + yy + " " + hh + ":" + min;
  }

  buildingBlockWithMessages() {
    if (!document.getElementById("allMessageBlock")) {
      const allMessageBlock = document.createElement("div");
      allMessageBlock.id = "allMessageBlock";
      mainConteiner.append(allMessageBlock);
    }
    const correspondenceBlock = document.createElement("div");
    correspondenceBlock.className = "correspondenceBlock";
    allMessageBlock.append(correspondenceBlock);
    return correspondenceBlock;
  }

  messageInformationGenerator(messageText) {
    const currentDate = new Date();
    const messageData = this.getData(currentDate);

    console.log("this.currentUserName");
    console.log(this.currentUserName);
    // todo: senderToken field must be dinamic
    let objectWithMessageInfo = {
      message: messageText,
      senderToken: this.currentUserName,
      departureTime: messageData,
    };
    return objectWithMessageInfo;
  }

  sendDataFunc(ws) {
    console.log("Data is here");
    let messageFromClient = document.getElementById(
      "inputWithMessageFromClient"
    ).value;
    const messageInfo = this.messageInformationGenerator(messageFromClient);
    console.log("messageInfo");
    console.log(messageInfo);

    // sending data to the server for writing to the db:
    const messageInfoInString = JSON.stringify(messageInfo);
    ws.send(messageInfoInString); //todo: process the object in the format required for sending to the server
    let correspondenceBlock = this.buildingBlockWithMessages();
    correspondenceBlock.innerText = messageFromClient;
  }
}
