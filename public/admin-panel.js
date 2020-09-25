class AdminPanel {
  createAdminPanel() {}
  createBlockWithAllUsers() {
    const infoContainer = document.getElementById("infoContainer");

    const allUsersBlock = document.createElement("div");
    allUsersBlock.id = "allUsersBlock";
    const blockHeader = document.createElement("p");
    blockHeader.id = "blockHeader";
    blockHeader.innerText = "ALL USERS:";

    allUsersBlock.append(blockHeader);
    infoContainer.append(allUsersBlock);
  }
  allUsersListBuilder(allUsers, ws) {
    let allUsersList = document.getElementById("allUsersList");
    if (allUsersList) {
      allUsersList.remove();
    }
    let ul = document.createElement("ul");
    ul.id = "allUsersList";

    allUsers.map((allUser) => {
      let li = document.createElement("li");
      li.className = "listItem";
      li.innerText = allUser; //.toUpperCase();

      let bttnContaineer = document.createElement("div");
      bttnContaineer.id = "bttnContaineer";
      let muteBttn = document.createElement("button");
      muteBttn.innerText = "M";
      muteBttn.id = "muteBttn";
      muteBttn.onclick = () => {
        //muteBttn.innerText = "Unmte" //подгружать из бд из поля
        let str = li.innerText;
        let usnm = str.split("MB")[0];
        usnm = usnm.replace(/\s/g, "");
        this.banMuteUser("onMute", usnm, ws);
      };
      let banBttn = document.createElement("button");
      banBttn.innerText = "B";
      banBttn.id = "banBttn";
      banBttn.onclick = () => {
        let str = li.innerText;
        let usnm = str.split("MB")[0];
        usnm = usnm.replace(/\s/g, "");
        this.banMuteUser("onBan", usnm, ws);
        //вызов ф-ции, которая отправляет данные на сервер через сокет,
        //на сервере меняются поля для нужного юзера и обновляются данные
      };

      ul.append(li);
      li.append(bttnContaineer);
      bttnContaineer.append(muteBttn);
      bttnContaineer.append(banBttn);
      return li;
    });

    let allUsersBlock = document.getElementById("allUsersBlock");
    allUsersBlock.append(ul);
  }

  banMuteUser(command, username, ws) {
    ws.send(JSON.stringify({ command, username, ws }));
  }
}
