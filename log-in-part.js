class LogInPart {
  constructor() {}
  logInFormBuilder() {
    let loginForm = document.getElementById("loginForm");
    let formContainer = document.createElement("form");
    formContainer.id = "formContainer";
    let usernameField = document.createElement("input");
    usernameField.id = "usernameField";

    let passwordField = document.createElement("input");
    passwordField.id = "passwordField";
    let logInSendButton = document.createElement("input");
    logInSendButton.value = "Log in";
    logInSendButton.onclick = this.formingDataForServer;

    loginForm.append(formContainer);
    formContainer.append(usernameField);
    formContainer.append(passwordField);
    formContainer.append(logInSendButton);
  }
  formingDataForServer() {
    /*
    НА СЕРВЕРЕ:
     *берутся данные у полей,
     *формируются в объект,
     *передаются в бд на запись
  
     НА КЛИЕНТЕ:
     данные могут только идти на сервер, 
     без обработки
     */

    let username = document.getElementById("usernameField").value;
    let password = document.getElementById("passwordField").value;
    let userToken = "";
    let adminStatus = "";

    const objectWithClientData = {
      username: username,
      password: password,
      userToken: userToken,
      adminStatus: adminStatus,
    };
  }
}
