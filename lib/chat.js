const mysql = require('mysql');

const pool = mysql.createPool({
  host: '', /* MySQL 数据库 host */
  user: '', /* MySQL 数据库 user */
  password: '', /* MySQL 数据库密码 */
  database: '', /* 数据库名称 */
});

const table = ''; /* 数据表名称 */

module.exports = class chat {
  // 创建用户
  touchUser(userid, code) {
    return new Promise((res) => {
      pool.query(`INSERT INTO ${table} (userid, code) VALUES (${userid}, "${code}")`, () => {
        res();
      });
    });
  }

  // 检查用户
  checkUser(userid) {
    return new Promise((res) => {
      pool.query(`SELECT * FROM ${table} WHERE userid = ${userid}`, (_, results) => {
        if (results[0] !== undefined) {
          res({ already: true, cc: results[0].code });
        } else {
          res({ already: false });
        }
      });
    });
  }

  // 获取目标用户 userid
  getId(code) {
    return new Promise((res) => {
      pool.query(`SELECT * FROM ${table} WHERE code = "${code}"`, (_, results) => {
        if (results[0] !== undefined) {
          res(results[0].userid);
        } else {
          res();
        }
      });
    });
  }
};
