class AdminPanel{
    createAdminPanel(){
    }
    createBlockWithAllUsers(){
        
    const infoContainer = document.getElementById("infoContainer");

    const allUsersBlock = document.createElement("div");
    allUsersBlock.id = "allUsersBlock";
    const blockHeader = document.createElement("p");
    blockHeader.id = "blockHeader";
    blockHeader.innerText = "ALL USERS:";

    allUsersBlock.append(blockHeader);
    infoContainer.append(allUsersBlock);
    }
}