module.exports = {
  // 基础配置
  token: '', // {String} 机器人的 API Token

  // 匿名聊天室配置
  chat: {
    path: './lib/xiaolanjing.db', // {String} 数据库路径
    table: 'chat_user', // {String} 数据库表名称
  }
}
