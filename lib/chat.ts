import * as mongoose from 'mongoose';
const conn = mongoose.createConnection('mongodb://127.0.0.1:27017/xiaolanjing', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

const chatSchema = mongoose.Schema({
  userid: Number,
  code: String
}, { collection: 'chat' });

const chatModel = conn.model('chat', chatSchema);

export default class Chat {
  // 创建用户
  async touchUser(userid: number, code: string) {
    await new chatModel({
      userid,
      code
    }).save();
  }

  // 检查用户
  async checkUser(userid: number) {
    return await chatModel.findOne({ userid });
  }

  // 获取目标用户
  async getId(code: string) {
    return await chatModel.findOne({ code });
  }
};
