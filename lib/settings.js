const mongoose = require('mongoose');
const conn = mongoose.createConnection('mongodb://127.0.0.1:27017/xiaolanjing', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

const sSchema = mongoose.Schema({
  chatid: Number,
  addel: Boolean,
}, { collection: 'settings' });

const sModel = conn.model('settings', sSchema);

module.exports = class Settings {
  constructor(chatId) {
    this.chatId = Number(chatId);
  }

  async getS() {
    const r = await sModel.findOne({ chatid: this.chatId });
    if (r === null) {
      this.init();
      return {
        chatid: this.chatId,
        addel: false,
      };
    }
    return r;
  }

  async init() {
    await new sModel({
      chatid: this.chatId,
      addel: false,
    }).save();
  }

  async updateS(obj) {
    await sModel.updateOne({ chatid: this.chatId }, obj);
  }
}
