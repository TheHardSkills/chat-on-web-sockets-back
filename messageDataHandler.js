const mongoose = require("mongoose");

class MessageDataHandler {
  constructor() {
    const Schema = mongoose.Schema;
    this.messageScheme = new Schema({
      message: String,
      senderToken: String,
      departureTime: String,
    });
    this.Message = mongoose.model("Message", this.messageScheme);
  }

  createMessage(messageInfo) {
    mongoose.connect("mongodb://localhost:27017/chatbd_draft_version", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(messageInfo);
    // todo: Sort out
    // Why should I write - "_id: false" ? If I don't write, an error occurs.
    const message = new this.Message(messageInfo, {
      _id: false,
      message: messageInfo.message,
      senderToken: messageInfo.senderToken,
      departureTime: messageInfo.departureTime,
    });

    message.save(function (err) {
      mongoose.disconnect();

      if (err) return console.log(err);
      console.log("Сохранен объект", message);
    });
  }
}

module.exports = MessageDataHandler;
