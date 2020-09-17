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
  userCreator() {}

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
    const allMessages = await result;
    return allMessages;
  }

  activeUsersFounder() {}
  getAllUsers() {}
}

module.exports = MongoDbDataProcessing;
