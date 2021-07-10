import { Markup } from 'telegraf';

export default async (ctx: any) => {
  ctx.i18n.locale('zh-hans');
  ctx.answerCbQuery(ctx.i18n.t('sls'));
  ctx.editMessageText(ctx.i18n.t('sl'), {
    ...Markup.inlineKeyboard([[
      Markup.button.callback(`🇨🇳中文 ✔️`, 'chinese'),
      Markup.button.callback(`🇬🇧English`, 'english')
    ], [
      Markup.button.callback('返回', 'back')
    ]])
  });
}
