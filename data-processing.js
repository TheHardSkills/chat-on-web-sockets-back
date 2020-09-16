class MongoDbDataProcessing {
  constructor() {
    this.MongoClient = require("mongodb").MongoClient;
    this.url = "mongodb://localhost:27017/";
    this.mongoClient = new MongoClient(url, { useNewUrlParser: true });
  }

  dataBaseCreator() {}
  userCreator() {}

  messageCreator() {
    mongoClient.connect(function (err, client) {
      // todo: read data from client
      let message = "Some message";
      let senderToken = 1;
      let recipientToken = 2;
      let departureTime = "16.09.2020 17:26"; //todo: new Date()
      const db = client.db("chatbd_draft_version"); // todo: move to constructor
      const collection = db.collection("messages");

      let messageInfo = {
        message: message,
        senderToken: senderToken,
        recipientToken: recipientToken,
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

  messagesFounder() {
    mongoClient.connect(function (err, client) {
      const db = client.db("chatbd_draft_version"); // todo: move to constructor
      const collection = db.collection("messages");

      collection.find().toArray(function (err, results) {
        console.log(results);
        client.close();
      });
    });
  }

  activeUsersFounder() {}
  getAllUsers() {}
}
