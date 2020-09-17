class LogInPart {
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
  async formingDataForServer() {
    /*
    *НА СЕРВЕРЕ:
     *берутся данные у полей,
     *формируются в объект,
     *передаются в бд на запись
  
     *НА КЛИЕНТЕ:
     *данные могут только идти на сервер, 
     *без обработки
     */

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

    // на момент регистрации сокет-соединения еще нет
    // =>
    // http-запрос на сервер (post):
    await fetch("http://localhost:7000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: JSON.stringify(objectWithUserData),
    });
    //let result = await response.json();
  }
}
