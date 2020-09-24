class ShowUsersOnline {
  buildingBlockWithOnlineUsers() {
    const mainConteiner = document.getElementById("mainConteiner");

    const onlineUsersBlock = document.createElement("div");
    onlineUsersBlock.id = "onlineUsersBlock";
    const blockHeader = document.createElement("p");
    blockHeader.id = "blockHeader";
    blockHeader.innerText = "ONLINE USERS:";

    onlineUsersBlock.append(blockHeader);
    mainConteiner.append(onlineUsersBlock);
  }
  onlineUsersListBuilder(onlineUsers) {
    let onlineUsersList = document.getElementById("onlineUsersList");
    if (onlineUsersList) {
      onlineUsersList.remove();
    }
    let ul = document.createElement("ul");
    ul.id = "onlineUsersList";

    onlineUsers.map((onlineUser) => {
      let li = document.createElement("li");
      li.className = "listItem";
      li.innerText = onlineUser.toUpperCase();
      ul.append(li);
      return li;
    });

    let onlineUsersBlock = document.getElementById("onlineUsersBlock");
    onlineUsersBlock.append(ul);
  }
}
