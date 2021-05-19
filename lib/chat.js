const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database(
  '', /* 数据库文件的目录 */
  sqlite3.OPEN_READWRITE
);

const table = ''; /* 数据表名称 */

module.exports = class chat {
  /* 创建用户 */
  touchUser(userid, code) {
    return new Promise((res) => {
      db.run(`INSERT INTO ${table} (userid, code) VALUES (${userid}, "${code}")`, () => {
        res();
      });
    });
  }

  /* 检查用户 */
  checkUser(userid) {
    return new Promise((res) => {
      db.all(`SELECT * FROM ${table} WHERE userid = ${userid}`, (_, results) => {
        if (results[0]) {
          res({ already: true, cc: results[0].code });
        } else {
          res({ already: false });
        }
      });
    });
  }

  /* 获取目标用户 userid */ 
  getId(code) {
    return new Promise((res) => {
      db.all(`SELECT * FROM ${table} WHERE code = "${code}"`, (_, results) => {
        if (results[0]) {
          res(results[0].userid);
        } else {
          res();
        }
      });
    });
  }
};
