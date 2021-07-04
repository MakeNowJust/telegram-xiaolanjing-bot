const { Markup } = require('telegraf');

module.exports = async (ctx) => {
  ctx.answerCbQuery();

  if (ctx.chat.type === 'private') {
    ctx.editMessageText('点击下面的按钮设置小蓝鲸', {
      ...Markup.inlineKeyboard([
        Markup.button.callback('设置语言', 'lang')
      ])
    });
    return;
  }

  const member = await ctx.getChatMember(ctx.from.id);

  if (!['administrator', 'creator'].includes(member.status)) {
    ctx.editMessageText('点击下面的按钮设置小蓝鲸', {
      ...Markup.inlineKeyboard([
        Markup.button.callback('设置语言', 'lang')
      ])
    });
    return;
  }

  ctx.editMessageText('点击下面的按钮设置小蓝鲸', {
    ...Markup.inlineKeyboard([[
      Markup.button.callback('设置语言', 'lang')
    ], [
      Markup.button.callback('群组设置', 'group')
    ]])
  });
}
