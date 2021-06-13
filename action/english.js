const { Markup } = require('telegraf');

module.exports = async (ctx) => {
  ctx.i18n.locale('en');
  ctx.answerCbQuery(ctx.i18n.t('sls'));
  ctx.editMessageText(ctx.i18n.t('sl'), {
    ...Markup.inlineKeyboard([
      Markup.button.callback(`🇨🇳中文`, 'chinese'),
      Markup.button.callback(`🇬🇧English ✔️`, 'english')
    ])
  });
}
