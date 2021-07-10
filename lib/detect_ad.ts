import * as fs from 'fs';
import * as jieba from '@node-rs/jieba';

const model: object = {};

jieba.load({ userDict: './user.dict' });

try {
  const data: string[] = fs.readFileSync('./lib/model', 'utf-8').split('\n');

  for (let i = 0; i < (data.length - 1); i++) {
    const items: any[] = data[i].split(' ');

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
  console.error(err);
}

export default async (text: string) => {
  if (text === '') {
    return false;
  }

  let spamRate: number = 0.8;
  let hamRate: number = 0.2;

  const textSet: any = new Set(jieba.cut(text));

  for (let word of textSet.keys()) {
    if (model[word] !== undefined) {
      spamRate *= model[word][1];
      hamRate *= model[word][2];
    }
  }

  const res: number = spamRate / (spamRate + hamRate);

  if (res < 0.9) {
    return false;
  } else {
    console.log(res, text);
    return true;;
  }
}
