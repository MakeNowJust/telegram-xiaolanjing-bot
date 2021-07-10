import * as mongoose from 'mongoose';
const conn = mongoose.createConnection('mongodb://127.0.0.1:27017/xiaolanjing', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

const listSchema = mongoose.Schema({
  _id: String,
  chatid: Number,
  rule: String,
  return: String
}, { collection: 'rules' });

const headSchema = mongoose.Schema({
  _id: String,
  big: String,
  empty: Array
}, { collection: 'rules' });

const listModel = conn.model('rules', listSchema);
const headModel = conn.model('headRules', headSchema);

export default class Rule {
  chatId: number;

  constructor(chatId: number) {
    this.chatId = Number(chatId);
  }

  async getRule(id: string) {
    return await listModel.findById(id);
  }

  async ruleList(skip: number) {
    return await listModel.find({ chatid: this.chatId }).skip(skip).limit(6);
  }

  async rulesNumber() {
    return await listModel.find({ chatid: this.chatId }).countDocuments();
  }

  async addRule(rule: string, r: string) {
    const n: number = await this.rulesNumber();

    if (n === 50) {
      throw '';
    }

    let number: any = await headModel.findById('0');
    number.empty = number.empty ?? [];
    let n1: string;

    if (number.empty.length > 0) {
      n1 = number.empty.pop();
      await headModel.findByIdAndUpdate('0', { empty: number.empty });
    } else {
      n1 = String(Number(number.big) + 1);
      await headModel.findByIdAndUpdate('0', { big: String(n) });
    }

    await new listModel({
      _id: n1,
      chatid: this.chatId,
      rule: rule,
      return: r
    }).save();

    return n1;
  }

  async allRules() {
    try {
      const list: object[] = await listModel.find({ chatid: this.chatId });
      return list;
    } catch (e) {
      console.error(e);
    }
  }

  async delRule(id: string) {
    const empty: any = await headModel.findById('0');
    empty.empty = empty.empty ?? [];
    empty.empty.push(id);
    await headModel.findByIdAndUpdate('0', { empty: empty.empty });
    await listModel.findByIdAndRemove(id);
  }

  async deleteAll() {
    const empty: any = await headModel.findById('0');
    empty.empty = empty.empty ?? [];
    const list: any[] = await listModel.find({ chatid: this.chatId});
    for (let i = 0; i < list.length; i++) {
      empty.empty.push(list[i]._id);
    }
    await headModel.findByIdAndUpdate('0', { empty: empty.empty });

    await listModel.deleteMany({ chatid: this.chatId });
  }
};
