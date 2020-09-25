class AdminPanel{
    createAdminPanel(){
    }
    createBlockWithAllUsers(){
        
    const mainConteiner = document.getElementById("mainConteiner");

    const allUsersBlock = document.createElement("div");
    allUsersBlock.id = "allUsersBlock";
    const blockHeader = document.createElement("p");
    blockHeader.id = "blockHeader";
    blockHeader.innerText = "ALL USERS:";

    allUsersBlock.append(blockHeader);
    mainConteiner.append(allUsersBlock);
    }
}