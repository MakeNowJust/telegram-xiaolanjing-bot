const Rule = require('./../../../lib/rule.js');

module.exports = async (ctx) => {
  if (ctx.chat.type === 'private') {
    return ctx.reply('此命令只能在群组中使用', { reply_to_message_id: ctx.message.message_id });
  }

  ctx.replyWithChatAction('typing');

  const member = await ctx.getChatMember(ctx.message.from.id);

  if (!['administrator', 'creator'].includes(member.status)) {
    return ctx.reply('这个命令是给管理员用的，不是给你用的！', { reply_to_message_id: ctx.message.message_id });
  }

  if (ctx.message.text.split(' ')[1].length === 1) {
    return ctx.replyWithMarkdown('规则删除方法：`/delrule 标识`', { reply_to_message_id: ctx.message.message_id });
  }

  const exist = await new Rule(ctx.chat.id).getRule(ctx.message.text.split(' ')[1]);

  if (exist.length === 0) {
    return ctx.reply('该规则不存在', { reply_to_message_id: ctx.message.message_id });
  }

  new Rule(ctx.chat.id).delRule(ctx.message.text.split(' ')[1])
    .then((result) => {
      ctx.reply('删除成功', { reply_to_message_id: ctx.message.message_id });
    });
}
