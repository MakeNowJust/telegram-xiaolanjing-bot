const Rule = require('./../../lib/rule.js');
const { Markup } = require('telegraf');

function page(number) {
  if (number === 6) {
    return Markup.inlineKeyboard([
      Markup.button.callback('下一页', 'nextpage')
    ]);
  }
}

function rediction(text) {                                              return text
    .replace(/\/_/g, '\\_')
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

module.exports = async (ctx) => {
  if (ctx.chat.type === 'private') {
    return ctx.reply('此命令只能在群组中使用', { reply_to_message_id: ctx.message.message_id });
  }

  ctx.replyWithChatAction('typing');

  const member = await ctx.getChatMember(ctx.message.from.id);

  if (!['administrator', 'creator'].includes(member.status)) {
    return ctx.reply('这个命令是给管理员用的，不是给你用的！', { reply_to_message_id: ctx.message.message_id });
  }

  new Rule(ctx.chat.id).ruleList(0)
    .then((results) => {
      if (ctx.chat.type === 'private') {
        ctx.reply('此命令只能在群组中使用', { reply_to_message_id: ctx.message.message_id });
      } else if (results.length > 0) {
        let msg = '';
        let number = 4096;

        for (let i = 0; i < (results.length === 6 ? 5 : results.length); i++) {
          number -= (136 + results[i].rule.length + results[i]['return'].length);

          if (number < 0) break;

          msg += `${i + 1}. \`${results[i].SHA512}\` ${results[i].rule}=>${results[i]['return']}
`;
        }

        ctx.replyWithMarkdown(rediction(msg), {
          reply_to_message_id: ctx.message.message_id,
          ...page(results.length)
        });
      } else {
        ctx.reply('还没有规则哦！', { reply_to_message_id: ctx.message.message_id });
      }
    });
}
