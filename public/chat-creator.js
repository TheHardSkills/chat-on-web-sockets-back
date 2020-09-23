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

  buildingBlockWithMessagesNewLogic(informationOfOneMessage) {
    if (!document.getElementById("allMessageBlock")) {
      const allMessageBlock = document.createElement("div");
      allMessageBlock.id = "allMessageBlock";
      mainConteiner.append(allMessageBlock);
    }
    const oneMessageBlock = document.createElement("div");
    oneMessageBlock.className = "oneMessageBlock";
    oneMessageBlock.innerText = informationOfOneMessage.message;

    const additionalInformationBlock = document.createElement("p");

    const usernameBlock = document.createElement("span");
    usernameBlock.className = "usernameBlock";
    usernameBlock.innerText = informationOfOneMessage.senderUsername;

    const messageSendingTimeBlock = document.createElement("span");
    messageSendingTimeBlock.className = "messageSendingTimeBlock";
    messageSendingTimeBlock.innerText = informationOfOneMessage.departureTime;

    oneMessageBlock.append(additionalInformationBlock);
    additionalInformationBlock.append(usernameBlock);
    additionalInformationBlock.append(messageSendingTimeBlock);
    allMessageBlock.append(oneMessageBlock);
    return oneMessageBlock;
  }

  messageInformationGenerator(messageText) {
    const currentDate = new Date();
    const messageData = this.getData(currentDate);

    console.log("this.currentUserName**");
    console.log(this.currentUserName);
    let objectWithMessageInfo = {
      message: messageText,
      senderUsername: this.currentUserName,
      departureTime: messageData,
    };
    return objectWithMessageInfo;
  }

  sendDataFunc(ws) {
    console.log("Data is here");
    let messageFromClient = document.getElementById(
      "inputWithMessageFromClient"
    ).value;
    if (messageFromClient.length <= 200) {
      let timeOfTheLastMessage = localStorage.getItem("timestamp");
      let now = new Date();
      let timestamp = now.getTime();

      if (
        Number(timeOfTheLastMessage) + 15000 <= timestamp ||
        (timeOfTheLastMessage == null && timeOfTheLastMessage == undefined)
      ) {
        localStorage.setItem("timestamp", timestamp);
        const messageInfo = this.messageInformationGenerator(messageFromClient);

        this.buildingBlockWithMessagesNewLogic(messageInfo);

        const messageInfoInString = JSON.stringify(messageInfo);
        ws.send(messageInfoInString);
        localStorage.setItem("currentUserName", this.currentUsername);
      } else {
        alert("You cannot send messages more than once every 15 seconds.");
      }
    } else {
      alert("One message can contain up to 200 characters!");
    }
  }
}
