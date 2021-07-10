import QRCode from 'qrcode';
import config from './../config';

function qr(ctx: any, content: string): void {
  ctx.replyWithChatAction('upload_photo');

  let msg: string = '';

  for (let i: number = 0; i < content.slice(0, -1).length; i++) {
    msg += `${content.slice(0, -1)[i]} `;
  }

  QRCode.toBuffer(msg, { version: version(Number(content.slice(-1))) }, (err: string, uri: any): void => {
    if (err) console.log(err);

    ctx.replyWithPhoto({
      source: uri
    }, { reply_to_message_id: ctx.message.message_id });
  });
}

function version(number: number): number {
  let v: number = 1;

  if ((number <= 40) && (number >= 1)) {
    v = number;
  }

  return v;
}

export default async (ctx: any) => {
  const content: string = ctx.message.text.slice(ctx.message.text.indexOf(' ') + 1);

  if (isNaN(+content.slice(-1))) {
    ctx.reply(ctx.i18n.t('noVersion'), { reply_to_message_id: ctx.message.message_id });
  } else if (content.toString()) {
    if (ctx.chat.type !== 'private') {
      const chat: any = await ctx.getChat();
      if (chat.permissions.can_send_media_messages) {
        qr(ctx, content);
      } else {
        const member: any = await ctx.getChatMember(config.token.split(':')[0])
        if (member.status === 'administrator') {
          qr(ctx, content);
        } else {
          ctx.reply(ctx.i18n.t('notSendMedia'), { reply_to_message_id: ctx.message.message_id });
        }
      }
    } else {
      qr(ctx, content);
    }
  } else {
    ctx.replyWithMarkdown(ctx.i18n.t('qrHelp'), { reply_to_message_id: ctx.message.message_id });
  }
}
