class SignInPart {
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
    logInSendButton.onclick = async () => {
      await this.formingDataForServer();

      this.currentUsername = document.getElementById("usernameField").value;
      localStorage.setItem("currentUserName", this.currentUsername);
      document.location = "http://localhost:7000/chat";
    };

    loginFormContainer.append(formLogIn);
    formLogIn.append(usernameField);
    formLogIn.append(passwordField);
    formLogIn.append(logInSendButton);

    return this.currentUsername;
  }
  async formingDataForServer() {
    let username = document.getElementById("usernameField").value;
    let password = document.getElementById("passwordField").value;
    let userToken = ""; // todo: delete
    let adminStatus = ""; // todo: the fist user on db

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
  }
}
