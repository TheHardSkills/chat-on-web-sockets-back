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
  allUsersListBuilder(allUsers) {
    let allUsersList = document.getElementById("allUsersList");
    if (allUsersList) {
      allUsersList.remove();
    }
    let ul = document.createElement("ul");
    ul.id = "allUsersList";

    allUsers.map((allUser) => {
      let li = document.createElement("li");
      li.className = "listItem";
      li.innerText = allUser.toUpperCase();
      ul.append(li);
      return li;
    });

    let allUsersBlock = document.getElementById("allUsersBlock");
    allUsersBlock.append(ul);
  }
}
