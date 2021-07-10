import { Markup } from 'telegraf';
import Settings from './../lib/settings';

interface Member {
  status: string;
}

export default async (ctx: any) => {
  if (ctx.chat.type === 'private') {
    ctx.answerCbQuery('私人聊天中此按钮无效哦！', { show_alert: true });
    return;
  }

  const member: Member = await ctx.getChatMember(ctx.from.id);

  if (!['administrator', 'creator'].includes(member.status)) {
    ctx.answerCbQuery('你不是管理员，点什么？！', { show_alert: true });
    return;
  }

  ctx.answerCbQuery();

  const s: any = await new Settings(ctx.chat.id).getS();

  ctx.editMessageText('点击下面的按钮进行设置', {
    ...Markup.inlineKeyboard([[
      Markup.button.callback(`检测中文广告并删除 ${s.addel === false ? '❎' : '✔️'}`, 'addel')
    ], [
      Markup.button.callback('返回', 'back')
    ]])
  });
}
