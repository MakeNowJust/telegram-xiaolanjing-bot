const { Markup } = require('telegraf');
const Rule = require('./../../lib/rule.js');

function rediction(text) {                                              return text                                                             .replace(/\/_/g, '\\_')
    .replace(/\|/g, '\\|')
    .replace(/\*/g, '\\*')
    .replace(/~/g, '\\~')
    .replace(/\/%/g, '%')
    .replace(/\/'/g, '\'')
    .replace(/\/;/g, ';')
    .replace(/\/\[/g, '\\[')
    .replace(/\/\]/g, '\\]')
    .replace(/\/&/g, '&')
    .replace(/\/\//g, '/')
    .replace(/\/\(/g, '\\(')
    .replace(/\/\)/g, '\\)')
    .replace(/\\n/g, '\\n');
}

function page(number) {
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

module.exports = async (ctx) => {
  const member = await ctx.getChatMember(ctx.from.id);

  if (!['administrator', 'creator'].includes(member.status)) {
    return ctx.answerCbQuery('你不能点这个按钮！', { show_alert: true });
  }

  ctx.answerCbQuery();

  let number = Number(ctx.callbackQuery.message.text.split('\n').slice(-1)[0][0]);

  if (number < 6) return;

  new Rule(ctx.chat.id).ruleList(number - ctx.callbackQuery.message.text.split('\n').length - 5)
    .then((results) => {
        if (results.length > 0) {
          number -= (ctx.callbackQuery.message.text.split('\n').length + 5);
          const n1 = number;
          let msg = '';
          let n = 4096;

          for (let i = 0; i < (results.length === 6 ? 5 : results.length); i++) {
            n -= (136 + results[i].rule.length + results[i]['return'].length);

            if (n < 0) break;

            msg += `${number += 1}. \`${results[i].SHA512}\` ${results[i].rule}=>${results[i]['return']}
`;
          }

          ctx.editMessageText(rediction(msg), {
            parse_mode: 'Markdown',
            ...page(n1)
          });
        }
    });
}