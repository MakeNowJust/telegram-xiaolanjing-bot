import Rule from './../../lib/rule';
import { check } from "@makenowjust-labo/recheck";

export default async (ctx: any) => {
  if (ctx.chat.type === 'private') {
    return ctx.reply('此命令只能在群组中使用', { reply_to_message_id: ctx.message.message_id });
  }

  ctx.replyWithChatAction('typing');

  const options: string = ctx.message.text.slice((ctx.message.text.indexOf(' ') === -1) ? 40 : (ctx.message.text.indexOf(' ') + 1));

  const member: Member = await ctx.getChatMember(ctx.message.from.id);

  if (options === '') {
    ctx.replyWithMarkdown('添加规则的方法请见 https://telegra.ph/小蓝鲸-addrule-命令使用方法-06-11', { reply_to_message_id: ctx.message.message_id });
    return;
  }

  if (!['administrator', 'creator'].includes(member.status)) {
    ctx.reply('这个命令是给管理员用的，不是给你用的！', { reply_to_message_id: ctx.message.message_id });
    return;
  }

  if (options.replace(/^(MESSAGE|AD):.*=>(DELETE|REPLY|BAN):.*$/, '') === '') {
    if (check(options.slice(options.indexOf(':') + 1, options.search(/=>(DELETE|REPLY):.*$/)), '').status === 'vulnerable') {
      ctx.reply('添加失败，你写的正则表达式会使小蓝鲸遭受 ReDOS', { reply_to_message_id: ctx.message.message_id });
    } else {
      try {
        const number: string = await new Rule(ctx.chat.id).addRule(options.slice(0, options.search(/=>(DELETE|REPLY):.*$/)), options.match(/=>(DELETE|REPLY):.*$/)[0].slice(2));
        ctx.replyWithMarkdown(`规则添加成功，标识为 \`${number}\``, { reply_to_message_id: ctx.message.message_id });
      } catch (e) {
        ctx.reply('因为某些原因，规则添加失败了', { reply_to_message_id: ctx.message.message_id });
        console.log(e);
      }
    }
  } else {
    ctx.reply('格式有问题！', { reply_to_message_id: ctx.message.message_id });
  }
}
