import Rule from './../../lib/rule';

export default async (ctx: any) => {
  if (ctx.chat.type === 'private') {
    ctx.reply('此命令只能在群组中使用', { reply_to_message_id: ctx.message.message_id });
    return;
  }

  ctx.replyWithChatAction('typing');

  const member: Member = await ctx.getChatMember(ctx.message.from.id);

  if (!['administrator', 'creator'].includes(member.status)) {
    ctx.reply('这个命令是给管理员用的，不是给你用的！', { reply_to_message_id: ctx.message.message_id });
    return;
  }

  if (ctx.message.text.split(' ')[1].length === 1) {
    ctx.replyWithMarkdown('规则删除方法：`/delrule 标识`', { reply_to_message_id: ctx.message.message_id });
    return;
  }

  const exist: any = await new Rule(ctx.chat.id).getRule(ctx.message.text.split(' ')[1]);

  if (exist.length === 0) {
    ctx.reply('该规则不存在', { reply_to_message_id: ctx.message.message_id });
    return;
  }

  try {
    await new Rule(ctx.chat.id).delRule(ctx.message.text.split(' ')[1])
    ctx.reply('删除成功', { reply_to_message_id: ctx.message.message_id });
  } catch (err) {
    ctx.reply('因为某些错误导致删除失败');
    console.log(err);
  }
}
