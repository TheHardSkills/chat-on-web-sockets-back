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

  async updateOneOfTheUser(username, newValue) {
    var connect = await this.MongoClient.connect(this.url, {
      useUnifiedTopology: true,
    });
    const db = connect.db("chatbd_draft_version");
    let result = new Promise(function (resolve, reject) {
      db.collection("users").findOneAndUpdate(
        { username: username },
        { $set: { isOnline: newValue } },
        function (err, result) {
          if (err) {
            return reject(err);
          }
          return resolve(result);
        }
      );
    });
    const oneUserInfo = await result;
    return oneUserInfo;
  }

  async findOneUser() {
    var connect = await this.MongoClient.connect(this.url, {
      useUnifiedTopology: true,
    });
    const db = connect.db("chatbd_draft_version");
    let result = new Promise(function (resolve, reject) {
      db.collection("users").findOne(function (err, docs) {
        if (err) {
          return reject(err);
        }
        return resolve(docs);
      });
    });
    const oneUserInfo = await result;
    return oneUserInfo;
  }

  async userCreator(userData) {
    let isAdmin = false;
    let someUser = await this.findOneUser();
    if (someUser == null) {
      isAdmin = true;
    }
    userConstructor.createUser(userData, isAdmin);
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

  async getUsersOnline() {
    var connect = await this.MongoClient.connect(this.url, {
      useUnifiedTopology: true,
    });
    const db = connect.db("chatbd_draft_version");
    const collection = db.collection("users");

    let result = new Promise(function (resolve, reject) {
      collection.find({ isOnline: true }).toArray(function (err, results) {
        if (err) {
          return reject(err);
        }
        return resolve(results);
      });
    });
    // todo: close connection
    const onlineUsers = await result;
    return onlineUsers;
  }

  async existingUserChecker(loggedInUserData) {
    const oneUserData = await this.getOneUserInfo(loggedInUserData.username);
    let loginResult = { isAuthorized: false, error: "" };

    if (oneUserData !== null) {
      if (oneUserData.password === loggedInUserData.password) {
        loginResult.isAuthorized = true;
      } else {
        loginResult.error =
          "The password was entered incorrectly, please try again.";
      }
    } else {
      this.userCreator(loggedInUserData);
      loginResult.isAuthorized = true;
    }
    let currentUserInDb;
    if (loginResult.isAuthorized === true) {
      currentUserInDb = await this.getOneUserInfo(loggedInUserData.username);
    }
    return { loginResult: loginResult, currentUserInDb: currentUserInDb };
  }
}

module.exports = MongoDbDataProcessing;
