const userDataHandler = require("./userDataHandler");
const messageDataHandler = require("./messageDataHandler");

const userConstructor = new userDataHandler();
const messageConstructor = new messageDataHandler();

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

  userCreator(userData) {
    userConstructor.createUser(userData);
  }

  messageCreator(messageData) {
    messageConstructor.createMessage(messageData);
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
      db.collection("users").findOne(
        { username: usernameSearchedUser },
        function (err, docs) {
          if (err) {
            return reject(err);
          }
          return resolve(docs);
        }
      );
    });
    // todo: close connection
    const oneUserInfo = await result;
    return oneUserInfo;
  }

  getUsersOnline() {}

  async existingUserChecker(loggedInUserData) {
    console.log("AAAAAAAAAAAAAA");
    console.log(loggedInUserData);

    const oneUserData = await this.getOneUserInfo(loggedInUserData.username);
    let loginResult = { isAuthorized: false, error: "" };

    if (oneUserData !== null) {
      if (oneUserData.password === loggedInUserData.password) {
        //login and display chat
        loginResult.isAuthorized = true;
      } else {
        loginResult.error =
          "The password was entered incorrectly, please try again.";
      }
    } else {
      //create new user
      this.userCreator(loggedInUserData);
      loginResult.isAuthorized = true;
    }

    return loginResult;
  }
}

module.exports = MongoDbDataProcessing;
