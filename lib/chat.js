const mongoose = require('mongoose');                      const conn = mongoose.createConnection('mongodb://127.0.0.1:27017/xiaolanjing', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

const chatSchema = mongoose.Schema({
  userid: Number,
  code: String
}, { collection: 'chat' });

const chatModel = conn.model('chat', chatSchema);

module.exports = class Chat {
  // 创建用户
  async touchUser(userid, code) {
    await new chatModel({
      userid,
      code
    }).save();
  }

  // 检查用户
  async checkUser(userid) {
    return await chatModel.findOne({ userid });
  }

  // 获取目标用户
  async getId(code) {
    return await chatModel.findOne({ code });
  }
};
