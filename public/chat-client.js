const ws = new WebSocket("ws://localhost:5000/");
ws.addEventListener("open", () => {
  console.log("We are connected!");
});
ws.addEventListener("message", ({ data }) => {
  console.log("dataaaaa");
  console.log(data);
});

let currentUserName = localStorage.getItem("currentUserName");
console.log("currentUserName");
console.log(currentUserName);

const chatModule = new ChatModule(currentUserName);
chatModule.messageFormBuilder(ws);
