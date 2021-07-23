import { Markup } from 'telegraf';
import Settings from './../lib/settings';

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

  const s: any = await new Settings(ctx.chat.id).getS();

  ctx.answerCbQuery('设置成功', { show_alert: true });

  await new Settings(ctx.chat.id).updateS({ addel: !s.addel });

  ctx.editMessageText('点击下面的按钮进行设置', {
    ...Markup.inlineKeyboard([[
      Markup.button.callback(`检测中文广告并删除${!s.addel? '✓' : ''}`, 'addel')
    ], [
      Markup.button.callback('返回', 'back')
    ]])
  });
}
