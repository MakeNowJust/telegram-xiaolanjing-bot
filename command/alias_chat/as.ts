import Chat from './../../lib/chat';

export default async (ctx: any) => {
  if (ctx.chat.type !== 'private') {
    ctx.reply(ctx.i18n.t('individual'), { reply_to_message_id: ctx.message.message_id });
    return;
  }
    
  const code = ctx.message.text.split(' ')[1] ?? '';
  const message = ctx.message.text.slice(5 + code);

  const userid = ctx.message.from.id;

  if (!(code && (message || ctx.message.reply_to_message))) {
    ctx.replyWithMarkdown(ctx.i18n.t('asHelp'), { reply_to_message_id: ctx.message.message_id });
    return;
  }

  if (!(/^\w{1,20}$/i.test(code))) {
    ctx.reply(ctx.i18n.t('incompatible'), { reply_to_message_id: ctx.message.message_id });
    return;
  }

  const user: any = await new Chat().checkUser(userid);

  if (!user) {
    ctx.replyWithMarkdown(ctx.i18n.t('noAccount'), { reply_to_message_id: ctx.message.message_id });
    return;
  }

  const c: any = await new Chat().getId(code);

  if (c === null) {
    ctx.reply(ctx.i18n.t('noCode', { code: code }), { reply_to_message_id: ctx.message.message_id });
    return;
  }

  if (ctx.message.reply_to_message) {
    const chat = await ctx.copyMessage(c.userid, {
      from_chat_id: ctx.chat.id,
      message_id: ctx.message.reply_to_message.message_id
    });

    ctx.reply(ctx.i18n.t('sendMessage', { code: c.code }), {
      chat_id: c.userid,
      reply_to_message_id: chat.message_id
    });
  } else {
    ctx.telegram.sendMessage(c.userid, `*${user.code}*: ${message}`, { parse_mode: 'Markdown' });
  }
    ctx.reply(ctx.i18n.t('sendMessage2'), { reply_to_message_id: ctx.message.message_id });
}
