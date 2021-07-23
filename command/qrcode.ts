import * as QRCode from 'qrcode';

function qr(ctx: any, content: string): void {
  ctx.replyWithChatAction('upload_photo');

  let msg: string = '';

  for (let i: number = 0; i < content.length - content.lastIndexOf(' ') - 1; i++) {
    msg += `${content.slice(0, -1)[i]} `;
  }

  QRCode.toBuffer(msg, { version: version(Number(content.slice(-1))) }, (err: Error, uri: any): void => {
    if (err) {
      ctx.reply(String(err), { reply_to_message_id: ctx.message.message_id });
      return;
    }

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
  if (ctx.chat.type !== 'private') {
    ctx.reply(ctx.i18n.t('individual'), { reply_to_message_id: ctx.message.message_id });
    return;
  }

  const content: string = ctx.message.text.slice(ctx.message.text.indexOf(' ') + 1);

  if (content === '/qrcode') {
    ctx.replyWithMarkdown(ctx.i18n.t('qrHelp'), { reply_to_message_id: ctx.message.message_id });
    return;
  }

  if (isNaN(+content.split(' ').slice(-1))) {
    ctx.reply(ctx.i18n.t('noVersion'), { reply_to_message_id: ctx.message.message_id });
  } else if (content.toString()) {
    qr(ctx, content);
  }
}
