const Chat = require('./../../../lib/chat.js');

module.exports = (ctx) => {
  if (ctx.chat.type === 'private') {
    const code = ctx.message.text.split(' ')[1];
    const msg = ctx.message.text.split(' ').slice(2);
    let message = '';

    for (let i = 0; i < msg.length; i++) {
      message += `${msg[i]} `;
    }

    const userid = ctx.message.from.id;
                                                                          if (code && (message || ctx.message.reply_to_message)) {
      if (/^\w{1,20}$/i.test(code) && /^\d{9,}$/.test(userid)) {
        new Chat().checkUser(String(userid)).then((res) => {
          if (!res) {
            ctx.replyWithMarkdown(ctx.i18n.t('noAccount'), { reply_to_message_id: ctx.message.message_id });
          } else {
            new Chat().getId(code).then((ress) => {
              if (ress) {
                if (ctx.message.reply_to_message) {
                  ctx.copyMessage(ress, {
                    from_chat_id: ctx.chat.id,
                    message_id: ctx.message.reply_to_message.message_id,
                  }).then((a) => {                                                        ctx.reply(ctx.i18n.t('sendMessage', { code: res }), {
                      chat_id: ress,
                      reply_to_message_id: a.message_id,
                    });
                  });
                } else {
                  ctx.telegram.sendMessage(ress, `*${res}*: ${message}`, { parse_mode: 'Markdown' });
                }
                ctx.reply(ctx.i18n.t('sendMessage2'), { reply_to_message_id: ctx.message.message_id });
              } else {
                ctx.reply(ctx.i18n.t('noCode', { code: code }), { reply_to_message_id: ctx.message.message_id });
              }
            });
          }
        });
      } else {
        ctx.replyWithMarkdown(ctx.i18n.t('incompatible'), { reply_to_message_id: ctx.message.message_id });
      }
    } else {
      ctx.replyWithMarkdown(ctx.i18n.t('asHelp'), { reply_to_message_id: ctx.message.message_id });
    }
  } else {
    ctx.reply(ctx.i18n.t('individual'), { reply_to_message_id: ctx.message.message_id });
  }
}
