import { Markup } from 'telegraf';
import Rule from './../lib/rule.js';

function page(length: number, linesNumber: number, number: number) {
  if (length === 6 && (linesNumber - number === 0)) {
    return Markup.inlineKeyboard([
      Markup.button.callback('下一页', 'nextpage')
    ])
  } else if (length === 6 && (linesNumber - number > 0)) {
    return Markup.inlineKeyboard([
      Markup.button.callback('上一页', 'lastpage'),
      Markup.button.callback('下一页', 'nextpage')
    ]);
  } else {
    return Markup.inlineKeyboard([
      Markup.button.callback('上一页', 'lastpage')
    ]);
  }
}

export default async (ctx: any) => {
  const member: Member = await ctx.getChatMember(ctx.from.id);

  if (!['administrator', 'creator'].includes(member.status)) {
    ctx.answerCbQuery('你不能点这个按钮！', { show_alert: true });
    return;
  }

  ctx.answerCbQuery();

  let number: number = Number(ctx.callbackQuery.message.text.split('\n').slice(-1)[0][0]);

  const results: any = await new Rule(ctx.chat.id).ruleList(number);
  
  if (results.length > 0) {
    let msg: string = '';
    let n: number = 4096;

    for (let i = 0; i < (results.length === 6 ? 5 : results.length); i++) {
      n -= (136 + results[i].rule.length + results[i]['return'].length);

      if (n < 0) break;

      msg += `${number += 1}. \`${results[i]._id}\` ${results[i].rule}=>${results[i]['return']}
`;
    }

    ctx.editMessageText(msg, {
      parse_mode: 'Markdown',
      ...page(results.length, ctx.callbackQuery.message.text.split('\n').length, number)
    });
  }
}
