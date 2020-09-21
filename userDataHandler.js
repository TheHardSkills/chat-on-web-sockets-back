const mongoose = require("mongoose");

class UserDataHandler {
  constructor() {
    const Schema = mongoose.Schema;
    this.userScheme = new Schema({
      username: String,
      password: String,
      userToken: String,
      adminStatus: String,
    });
    this.User = mongoose.model("User", this.userScheme);
  }

  createUser(userInfo) {
    mongoose.connect("mongodb://localhost:27017/chatbd_draft_version", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const user = new this.User({
      username: userInfo.username,
      password: userInfo.password,
      userToken: userInfo.userToken,
      adminStatus: userInfo.adminStatus,
    });

    user.save(function (err) {
      mongoose.disconnect();

      if (err) return console.log(err);
      console.log("Сохранен объект", user);
    });
  }
}

module.exports = UserDataHandler;
