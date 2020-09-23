const mongoose = require("mongoose");

class UserDataHandler {
  constructor() {
    const Schema = mongoose.Schema;
    this.userScheme = new Schema({
      username: String,
      password: String,
      isOnline: {
        type: Boolean,
        default: false,
      },
      adminStatus: {
        type: Boolean,
        default: false,
      },
      onMute: {
        type: Boolean,
        default: false,
      },
      onBan: {
        type: Boolean,
        default: false,
      },
    });
    this.User = mongoose.model("User", this.userScheme);
  }

  async createUser(userInfo, isAdmin) {
    mongoose.connect("mongodb://localhost:27017/chatbd_draft_version", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const user = new this.User({
      username: userInfo.username,
      isOnline: userInfo.isOnline,
      password: userInfo.password,
      adminStatus: isAdmin,
      onMute: userInfo.onMute,
      onBan: userInfo.onBan,
    });

    user.save(function (err) {
      console.log("CREATEEEE");
      mongoose.disconnect();

      if (err) return console.log(err);
      //console.log("Сохранен объект", user);
    });
  }
}

module.exports = UserDataHandler;
