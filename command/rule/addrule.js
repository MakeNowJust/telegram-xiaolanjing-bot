const Rule = require('./../../lib/rule.js');
const { check } = require("@makenowjust-labo/recheck");

function guolv(text) {
  return text
    .replace(/\//g, '//')
    .replace(/_/g, '/_')
    .replace(/%/g, '/%')
    .replace(/"/g, '/\'')
    .replace(/;/g, '/;')
    .replace(/\[/g, '/[')
    .replace(/\]/g, '/]')
    .replace(/&/g, '/&')
    .replace(/\(/g, '/(')
    .replace(/\)/g, '/)');
}

module.exports = async (ctx) => {
  if (ctx.chat.type === 'private') {
    return ctx.reply('此命令只能在群组中使用', { reply_to_message_id: ctx.message.message_id });
  }

  ctx.replyWithChatAction('typing');

  const options = ctx.message.text.slice((ctx.message.text.indexOf(' ') === -1) ? 40 : (ctx.message.text.indexOf(' ') + 1));

  const member = await ctx.getChatMember(ctx.message.from.id);

  if (options === '') {
    return ctx.replyWithMarkdown('添加规则的方法请见 https://telegra.ph/小蓝鲸-addrule-命令使用方法-06-11', { reply_to_message_id: ctx.message.message_id });
  }

  if (!['administrator', 'creator'].includes(member.status)) {
    ctx.reply('这个命令是给管理员用的，不是给你用的！', { reply_to_message_id: ctx.message.message_id });
  } else {
    if (options.replace(/^(MESSAGE|AD):.*=>(DELETE|REPLY|BAN):.*$/, '') === '') {
      if (check(options.slice(options.indexOf(':') + 1, options.search(/=>(DELETE|REPLY):.*$/)), '').status === 'vulnerable') {
        ctx.reply('添加失败，你写的正则表达式会使小蓝鲸遭受 ReDOS', { reply_to_message_id: ctx.message.message_id });
      } else {
        new Rule(ctx.chat.id).addRule(guolv(options.slice(0, options.search(/=>(DELETE|REPLY):.*$/))), guolv(options.match(/=>(DELETE|REPLY):.*$/)[0].slice(2)))
          .then((digest) => {
            ctx.replyWithMarkdown(`规则添加成功，标识为 \`${digest}\``, { reply_to_message_id: ctx.message.message_id });
          }, () => {
            ctx.reply('添加失败，该规则已经被添加过', { reply_to_message_id: ctx.message.message_id });
          });
      }
    } else {
      ctx.reply('格式有问题！', { reply_to_message_id: ctx.message.message_id });
    }
  }
}
