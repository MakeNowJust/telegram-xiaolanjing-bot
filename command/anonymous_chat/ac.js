const Chat = require('./../../../lib/chat.js');

module.exports = (ctx) => {
  if (ctx.chat.type === 'private') {
    const code = ctx.message.text.split(' ')[1];
    const userid = ctx.message.from.id;

    new Chat().checkUser(String(userid)).then((res) => {
      if (!res) {
        if (code) {
          if (/^\w{1,20}$/i.test(code) && /^\d{9,}$/.test(userid)) {
            ctx.reply(ctx.i18n.t('registering'), { reply_to_message_id: ctx.message.message_id }).then((chat) => {
              new Chat().touchUser(String(userid), code).then(() => {
                ctx.telegram.editMessageText(
                  chat.chat.id,
                  chat.message_id,
                  undefined,
                  ctx.i18n.t('rSuccess')
                );
              });
            });
          } else {
            ctx.replyWithMarkdown(ctx.i18n.t('incompatible'), { reply_to_message_id: ctx.message.message_id });
          }
        } else {
          ctx.replyWithMarkdown(ctx.i18n.t('rHelp'), { reply_to_message_id: ctx.message.message_id });
        }
      } else {
        ctx.reply(ctx.i18n.t('alreadyR'), { reply_to_message_id: ctx.message.message_id });
      }
    });
  } else {
    ctx.reply(ctx.i18n.t('individual'), { reply_to_message_id: ctx.message.message_id });
  }
}
