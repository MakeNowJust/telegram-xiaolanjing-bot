const Chat = require('./../../../lib/chat.js');

module.exports = (ctx) => {
  if (ctx.chat.type === 'private') {
    ctx.reply(ctx.i18n.t('Querying'), { reply_to_message_id: ctx.message.message_id }).then((message) => {
      new Chat().checkUser(String(ctx.message.from.id)).then((res) => {
        if (res) {
          ctx.telegram.editMessageText(
            message.chat.id,
            message.message_id,
            undefined,
            ctx.i18n.t('code', { code: res })
          );
        } else {
          ctx.telegram.editMessageText(
            message.chat.id,
            message.message_id,
            undefined,
            ctx.i18n.t('notAccount')
          );
        }
      });
    });
  } else {
    ctx.reply(ctx.i18n.t('individual'), { reply_to_message_id: ctx.message.message_id });
  }
}
