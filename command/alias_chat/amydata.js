const Chat = require('./../../lib/chat.js');

module.exports = async (ctx) => {
  if (ctx.chat.type !== 'private') {
    ctx.reply(ctx.i18n.t('individual'), { reply_to_message_id: ctx.message.message_id });
    return;
  }
    
  const chat = await ctx.reply(ctx.i18n.t('Querying'), { reply_to_message_id: ctx.message.message_id })

  const user = await new Chat().checkUser(ctx.message.from.id);

  if (user !== null) {
    ctx.telegram.editMessageText(
      chat.chat.id,
      chat.message_id,
      undefined,
      ctx.i18n.t('code', { code: user.code })
    );
  } else {
    ctx.telegram.editMessageText(
      chat.chat.id,
      chat.message_id,
      undefined,
      ctx.i18n.t('notAccount')
    );
  }
}
