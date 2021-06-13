const { Markup } = require('telegraf');

module.exports = (ctx) => {
  const lang = {
    'cn': '',
    'en': '',
  };

  if (ctx.session.__language_code === 'zh-hans') {
    lang.cn = '✔️';
  } else if (ctx.session.__language_code === 'en') {
    lang.en = '✔️';
  }

  ctx.reply(ctx.i18n.t('sl'), {
    reply_to_message_id: ctx.message.message_id,
    ...Markup.inlineKeyboard([
      Markup.button.callback(`🇨🇳中文 ${lang.cn}`, 'chinese'),
      Markup.button.callback(`🇬🇧English ${lang.en}`, 'english')
    ])
  });
}
