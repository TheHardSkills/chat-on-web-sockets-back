class MongoDbDataProcessing {
  constructor() {
    this.MongoClient = require("mongodb").MongoClient;
    this.url = "mongodb://localhost:27017/";
    this.mongoClient = new this.MongoClient(this.url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }

  dataBaseCreator() {}
  userCreator(data) {
    this.mongoClient.connect(function (err, client) {
      // "adminStatus" must be true or false
      let userInfo = {
        username: data.username,
        password: data.password,
        userToken: data.userToken,
        adminStatus: data.adminStatus,
      };

      const db = client.db("chatbd_draft_version"); // todo: move to constructor
      const collection = db.collection("users");

      collection.insertOne(userInfo, function (err, result) {
        if (err) {
          return console.log(err);
        }
        console.log(result.ops);
        client.close();
      });
    });
  }

  messageCreator(objectWithMessageInfo) {
    this.mongoClient.connect(function (err, client) {
      let message = objectWithMessageInfo.message;
      let senderToken = objectWithMessageInfo.senderToken;
      let departureTime = objectWithMessageInfo.departureTime;

      const db = client.db("chatbd_draft_version"); // todo: move to constructor
      const collection = db.collection("messages");

      let messageInfo = {
        message: message,
        senderToken: senderToken,
        departureTime: departureTime,
      };

      collection.insertOne(messageInfo, function (err, result) {
        if (err) {
          return console.log(err);
        }
        console.log(result.ops);
        client.close();
      });
    });
  }

  async messagesFounder() {
    var connect = await this.MongoClient.connect(this.url, {
      useUnifiedTopology: true,
    });

    const db = connect.db("chatbd_draft_version");
    let result = new Promise(function (resolve, reject) {
      db.collection("messages")
        .find()
        .toArray(function (err, docs) {
          if (err) {
            return reject(err);
          }
          return resolve(docs);
        });
    });
    // todo: close connection
    const allMessages = await result;
    return allMessages;
  }

  activeUsersFounder() {}
  async getAllUsers() {
    var connect = await this.MongoClient.connect(this.url, {
      useUnifiedTopology: true,
    });

    const db = connect.db("chatbd_draft_version");
    let result = new Promise(function (resolve, reject) {
      db.collection("users")
        .find()
        .toArray(function (err, docs) {
          if (err) {
            return reject(err);
          }
          return resolve(docs);
        });
    });
    // todo: close connection
    const allUsers = await result;
    return allUsers;
  }

  async getOneUserInfo(usernameSearchedUser) {
    //usernameSearchedUser
    var connect = await this.MongoClient.connect(this.url, {
      useUnifiedTopology: true,
    });
    const db = connect.db("chatbd_draft_version");
    let result = new Promise(function (resolve, reject) {
      db.collection("users").findOne({ username: "Some" }, function (
        err,
        docs
      ) {
        if (err) {
          return reject(err);
        }
        return resolve(docs);
      });
    });
    // todo: close connection
    const oneUserInfo = await result;
    return oneUserInfo;
  }

  getUsersOnline() {}

  async existingUserChecker(loggedInUserData) {
    //return true/false 'user creator'
    var connect = await this.MongoClient.connect(this.url, {
      useUnifiedTopology: true,
    });
    const db = connect.db("chatbd_draft_version");
    let result = new Promise(function (resolve, reject) {
      db.collection("users").findOne(
        { username: "Jkl" }, //todo: loggedInUserData.userName
        function (err, docs) {
          if (err) {
            //создание такого юзера
            this.userCreator(loggedInUserData);
            return "User was created";
          } else {
            if (docs !== null) {
              //сравнение пароля из формы с паролем в БД:
              let enteredPassword = "asdasd"; // todo: loggedInUserData.password;
              console.log("docs");
              console.log(docs);
              let databasePassword = docs.password;
              if (enteredPassword === databasePassword) {
                return true;
                //на сервере реализовать вход в систему -
                //отображение сообщений, связанных с этим пользователем
              } else {
                //
                return false;
              }
              //return resolve(docs);
            }
          }
        }
      );
    });
    // todo: close connection
    const oneUserInfo = await result;
    return oneUserInfo;
  }
}

module.exports = MongoDbDataProcessing;
