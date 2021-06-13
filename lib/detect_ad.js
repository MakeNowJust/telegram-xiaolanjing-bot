const fs = require('fs');
const jieba = require('@node-rs/jieba');

jieba.load();

const model = {};

try {
  const data = fs.readFileSync('./lib/model', 'utf-8').split('\n');

  for (let i = 0; i < (data.length - 1); i++) {
    const items = data[i].split(' ');

    if (Math.abs(items[2] - items[3]) > 0.15) {
      model[items[0]] = [items[1], items[2], items[3]];
    }
    if (items[3] > 0.05 && items[2] < 0.01) {
      model[items[0]] = [items[1], items[3] / 20, items[3]];
    } else if (items[2] > 0.05 && items[3] < 0.01) {
      model[items[0]] = [items[1], items[2], items[2] / 20];
    }
  }
} catch (err) {
  console.log(err);
}

module.exports = (text) => {
  let spamRate = 0.5
  let hamRate = 0.5

  const textSet = new Set(jieba.cut(text));

  for (let word of textSet.keys()) {
    if (model[word] !== undefined) {
      spamRate *= model[word][1];
      hamRate *= model[word][2];
    }
  }

  const res = spamRate / (spamRate + hamRate);

  if (res < 0.9) {
    return false;
  } else {
    return true;;
  }
}
