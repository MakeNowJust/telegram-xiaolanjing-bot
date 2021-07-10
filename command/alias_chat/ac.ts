import Chat from './../../lib/chat';

export default async (ctx: any) => {
  if (ctx.chat.type !== 'private') {
    ctx.reply(ctx.i18n.t('individual'), { reply_to_message_id: ctx.message.message_id });
    return;
  }
    
  const code: string = ctx.message.text.replace(/\s{2,}/, ' ').split(' ')[1];
  const userid: number = ctx.message.from.id;

  const already: object = await new Chat().checkUser(userid);

  if (already) {
    ctx.reply(ctx.i18n.t('alreadyR'), { reply_to_message_id: ctx.message.message_id });
    return;
  }
        
  if (!code) {
    ctx.replyWithMarkdown(ctx.i18n.t('rHelp'), { reply_to_message_id: ctx.message.message_id });
    return;
  }

  if (/^\w{1,20}$/i.test(code)) {
    const chat = await ctx.reply(ctx.i18n.t('registering'), { reply_to_message_id: ctx.message.message_id });

    await new Chat().touchUser(userid, code);
    
    ctx.telegram.editMessageText(
      chat.chat.id,
      chat.message_id,
      undefined,
      ctx.i18n.t('rSuccess')
    );
  } else {
    ctx.replyWithMarkdown(ctx.i18n.t('incompatible'), { reply_to_message_id: ctx.message.message_id });
  }
}
