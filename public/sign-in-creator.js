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
      let resultOfChecking = await this.formingDataForServer();
      if (!resultOfChecking) {
        return;
      } else {
        this.currentUsername = document.getElementById("usernameField").value;
        localStorage.setItem("currentUserName", this.currentUsername);
        document.location = "http://localhost:7000/chat";
      }
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
    let adminStatus = false; //dynamic - если в коллекции юзеров данных нет
    let onMute = false; //dynamic
    let onBan = false; //dynamic

    var format = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    let resultUsernameCheck = format.test(username);
    if (resultUsernameCheck) {
      alert("The use of special characters is prohibited.");
      return false;
    }
    if (username.length < 3) {
      alert("The minimum number of characters is 3.");
      return false;
    }
    if (password.length < 1) {
      alert("Password field cannot be empty.");
    } else {
      const objectWithUserData = {
        username: username,
        password: password,
        adminStatus: adminStatus,
        onMute: onMute,
        onBan: onBan,
      };

      await fetch("http://localhost:7000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: JSON.stringify(objectWithUserData),
      });
      return true;
    }
  }
}
