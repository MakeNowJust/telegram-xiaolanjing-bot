const { Markup } = require('telegraf');

module.exports = (ctx) => {
  ctx.answerCbQuery();
  const lang = {
    'cn': '',
    'en': '',
  };

  if (ctx.session.__language_code === 'zh-hans') {
    lang.cn = '✔️';
  } else if (ctx.session.__language_code === 'en') {
    lang.en = '✔️';
  }

  ctx.editMessageText(ctx.i18n.t('sl'), {
    ...Markup.inlineKeyboard([[
      Markup.button.callback(`🇨🇳中文 ${lang.cn}`, 'chinese'),
      Markup.button.callback(`🇬🇧English ${lang.en}`, 'english')
    ], [
      Markup.button.callback('返回', 'back')
    ]])
  });
}
