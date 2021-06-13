const QRCode = require('qrcode');
const config = require('./../../config.js');

function qr(ctx, content) {
  ctx.replyWithChatAction('upload_photo');

  let msg = '';

  for (let i = 0; i < content.slice(0, -1).length; i++) {
    msg += `${content.slice(0, -1)[i]} `;
  }

  QRCode.toBuffer(msg, { version: version(content.slice(-1), content) }, (err, uri) => {
    if (err) console.log(err);

    ctx.replyWithPhoto({
      source: uri
    }, { reply_to_message_id: ctx.message.message_id });
  });
}

function version(number, content) {
  let v = 1;

  if ((number <= 40) && (number >= 1)) {
    v = number;
  }

  return v;
}

module.exports = (ctx) => {
  const content = ctx.message.text.split(' ').slice(1);

  if ((String(Number(content.slice(-1)[0])) === 'NaN' && content.slice(-1)[0] !== undefined)  || content.length === 1) {
    ctx.reply(ctx.i18n.t('noVersion'), { reply_to_message_id: ctx.message.message_id });
  } else if (content.toString()) {
    if (ctx.chat.type !== 'private') {
      ctx.getChat().then((chat) => {
        if (chat.permissions.can_send_media_messages) {
          qr(ctx, content);
        } else {
          ctx.getChatMember(config.token.split(':')[0]).then((chatmember) => {
            if (chatmember.status === 'administrator') {
              qr(ctx, content);
            } else {
              ctx.reply(ctx.i18n.t('notSendMedia'), { reply_to_message_id: ctx.message.message_id });
            }
          });
        }
      });
    } else {
      qr(ctx, content);
    }
  } else {
    ctx.replyWithMarkdown(ctx.i18n.t('qrHelp'), { reply_to_message_id: ctx.message.message_id });
  }
}
