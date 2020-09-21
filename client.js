const ws = new WebSocket("ws://localhost:5000/");
ws.addEventListener("open", () => {
  console.log("We are connected!");
});
ws.addEventListener("message", ({ data }) => {
  console.log("dataaaaa");
  console.log(data);
});

const logInPart = new SignInPart();
logInPart.logInFormBuilder();
let currentUserName = "Dan";

const chatModule = new ChatModule(currentUserName);
chatModule.messageFormBuilder(ws);
