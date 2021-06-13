const sqlite3 = require('sqlite3').verbose();
const crypto = require('crypto');
const config = require('./../config');

const db = new sqlite3.Database(
  config.rules.path,
  sqlite3.OPEN_READWRITE
);

const table = config.rules.table;

module.exports = class Rule {
  constructor(chatId) {
    this.chatId = chatId;
  }

  getRule(sha512) {
    return new Promise((res) => {
      db.all(`SELECT SHA512,rule,return FROM rules WHERE chatid = ${this.chatId} AND SHA512 = "${sha512}"`, (err, result) => {
        if (err) console.log(err);
 
        res(result);
     });
    })
  }

  ruleList(offset) {
    return new Promise((res) => {
      db.all(`SELECT SHA512,rule,return FROM rules WHERE chatid = ${this.chatId} LIMIT 6 OFFSET ${offset}`, (err, results) => {
        if (err) console.log(err);

        res(results);
      });
    });
  }

  rulesNumber() {
    return new Promise((res) => {
      db.all(`SELECT COUNT(*) FROM rules WHERE chatid = ${this.chatId}`, (err, results) => {
        if (err) console.log(err);
        res(results.length);
      });
    });
  }

  addRule(rule, r) {
    return new Promise(async (res, rej) => {
      const digest = crypto.createHash('sha512').update(rule + '=>' + r).digest('hex');
      const number = await this.rulesNumber();

      if (number <= 50) {
        this.getRule(digest)
        .then((result) => {
          if (result.length === 0) {
            db.run(`INSERT INTO rules VALUES (${this.chatId}, "${digest}", "${rule}", "${r}")`, (err) => {
              if (err) console.log(err);
              res(digest);
            });
          } else {
            rej();
          }
        });
      }
    });
  }

  allRules() {
    return new Promise((res) => {
      db.all(`SELECT rule,return FROM rules WHERE chatid = ${this.chatId}`, (err, results) => {
        if (err) console.log(err);

        res(results);
      });
    });
  }

  delRule(sha512) {
    return new Promise((res) => {
      db.run(`DELETE FROM rules WHERE chatid = ${this.chatId} AND SHA512 = "${sha512}"`, (err) => {
        if (err) console.log(err);

        res(result);
      });
    });
  }
};
