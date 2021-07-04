const { Markup } = require('telegraf');

module.exports = async (ctx) => {
  if (ctx.chat.type === 'private') {
    ctx.reply('点击下面的按钮设置小蓝鲸', {
      reply_to_message_id: ctx.message.message_id,
      ...Markup.inlineKeyboard([
        Markup.button.callback('设置语言', 'lang')
      ])
    });
    return;
  }

  const member = await ctx.getChatMember(ctx.message.from.id);

  if (!['administrator', 'creator'].includes(member.status)) {
    ctx.reply('点击下面的按钮设置小蓝鲸', {
      reply_to_message_id: ctx.message.message_id,
      ...Markup.inlineKeyboard([
        Markup.button.callback('设置语言', 'lang')
      ])
    });
    return;
  }

  ctx.reply('点击下面的按钮设置小蓝鲸', {
    reply_to_message_id: ctx.message.message_id,
    ...Markup.inlineKeyboard([[
      Markup.button.callback('设置语言', 'lang')
    ], [
      Markup.button.callback('群组设置', 'group')
    ]])
  });
}
