class ShowUsersOnline {
  buildingBlockWithOnlineUsers() {
    const mainConteiner = document.getElementById("mainConteiner");

    const onlineUsersBlock = document.createElement("div");
    onlineUsersBlock.id = "onlineUsersBlock";
    const blockHeader = document.createElement("p");
    blockHeader.id = "blockHeader";
    blockHeader.innerText = "Online Users:";

    onlineUsersBlock.append(blockHeader);
    mainConteiner.append(onlineUsersBlock);
  }
}
