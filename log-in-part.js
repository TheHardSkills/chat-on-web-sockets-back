class SignInPart {
  constructor() {
    this.currentUserId;
  }
  logInFormBuilder() {
    let loginFormContainer = document.getElementById("loginForm");
    let formLogIn = document.createElement("form");
    formLogIn.id = "formLogIn";

    let usernameField = document.createElement("input");
    usernameField.id = "usernameField";
    usernameField.placeholder = "username";

    let passwordField = document.createElement("input");
    passwordField.id = "passwordField";
    passwordField.placeholder = "password";

    let logInSendButton = document.createElement("input");
    logInSendButton.value = "Sign in";
    logInSendButton.className = "button";
    logInSendButton.onclick = this.formingDataForServer;

    loginFormContainer.append(formLogIn);
    formLogIn.append(usernameField);
    formLogIn.append(passwordField);
    formLogIn.append(logInSendButton);
  }
  async formingDataForServer() {
    let username = document.getElementById("usernameField").value;
    let password = document.getElementById("passwordField").value;
    let userToken = ""; // todo: some tokenGenerator
    let adminStatus = ""; // todo: input for reading adminStatus (true / false)

    const objectWithUserData = {
      username: username,
      password: password,
      userToken: userToken,
      adminStatus: adminStatus,
    };

    // window.location.href = `/chat${userId}`

    let response = await fetch("http://localhost:7000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: JSON.stringify(objectWithUserData),
    });
    let res = await response.json();
    console.log(res);

    this.currentUserId = res._id;
    console.log("this.currentUserId");
    console.log(this.currentUserId);
  }
}
