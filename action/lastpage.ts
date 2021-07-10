import { Markup } from 'telegraf';
import Rule from './../lib/rule.js';

function page(number: number) {
  if (number === 0) {
    return Markup.inlineKeyboard([
      Markup.button.callback('下一页', 'nextpage')
    ])
  } else {
    return Markup.inlineKeyboard([
      Markup.button.callback('上一页', 'lastpage'),
      Markup.button.callback('下一页', 'nextpage')
    ]);
  }
}

export default async (ctx: any) => {
  const member: Member = await ctx.getChatMember(ctx.from.id);

  if (!['administrator', 'creator'].includes(member.status)) {
    return ctx.answerCbQuery('你不能点这个按钮！', { show_alert: true });
  }

  ctx.answerCbQuery();

  let number: number = Number(ctx.callbackQuery.message.text.split('\n').slice(-1)[0][0]);

  if (number < 6) {
    return;
  }

  const results: any = await new Rule(ctx.chat.id).ruleList(number - ctx.callbackQuery.message.text.split('\n').length - 5);
  
  if (results.length > 0) {
    number -= (ctx.callbackQuery.message.text.split('\n').length + 5);
    const n1: number = number;
    let msg: string = '';
    let n: number = 4096;

    for (let i = 0; i < (results.length === 6 ? 5 : results.length); i++) {
      n -= (136 + results[i].rule.length + results[i]['return'].length);

      if (n < 0) {
        break;
      }

      msg += `${number += 1}. \`${results[i]._id}\` ${results[i].rule}=>${results[i]['return']}
`;
    }

    ctx.editMessageText(msg, {
      parse_mode: 'Markdown',
      ...page(n1)
    });
  }
}
