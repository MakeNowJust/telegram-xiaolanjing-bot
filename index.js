const { Telegraf } = require('telegraf');
const TelegrafI18n = require('telegraf-i18n');
const LocalSession = require('telegraf-session-local');
const { generateUpdateMiddleware } = require('telegraf-middleware-console-time');

const path = require('path');

const config = require('./config.js');

const addRule = require('./command/xiaolanjing/rule/addrule.js');
const ruleList = require('./command/xiaolanjing/rule/rulelist.js');
const delRule = require('./command/xiaolanjing/rule/delrule.js');
const id = require('./command/xiaolanjing/id.js');
const qrcode = require('./command/xiaolanjing/qrcode.js');
const amydata = require('./command/xiaolanjing/alias_chat/amydata.js');
const ac = require('./command/xiaolanjing/alias_chat/ac.js');
const as = require('./command/xiaolanjing/alias_chat/as.js');
const dns = require('./command/xiaolanjing/dns.js');
const ip = require('./command/xiaolanjing/ip.js');
const settings = require('./command/xiaolanjing/settings.js');

const message = require('./message.js');

const Rule = require('./lib/rule.js');

const lang = require('./action/xiaolanjing/lang.js');
const lastPage = require('./action/xiaolanjing/lastpage.js');
const nextPage = require('./action/xiaolanjing/nextpage.js');
const chinese = require('./action/xiaolanjing/chinese.js');
const english = require('./action/xiaolanjing/english.js');
const back = require('./action/xiaolanjing/back.js');
const group = require('./action/xiaolanjing/group.js');
const addel = require('./action/xiaolanjing/addel.js');

const i18n = new TelegrafI18n({
  defaultLanguage: 'zh-hans',
  useSession: true,
  directory: path.resolve(process.cwd(), 'locales'),
});

const bot = new Telegraf(config.token);

const Id = Number(config.token.split(':')[0]);

bot.use((new LocalSession({ database: 'session.json' })).middleware());
bot.use(i18n.middleware());
bot.use(generateUpdateMiddleware());

function i18nRediction(text) {
  return text
    .replace(/\./g, '\\.')
    .replace(/-/g, '\\-');
}

bot.start((ctx) => {
  ctx.reply(ctx.i18n.t('start'), { reply_to_message_id: ctx.message.message_id });
});

bot.help((ctx) => {
  ctx.replyWithMarkdown(ctx.i18n.t('help'), { reply_to_message_id: ctx.message.message_id });
});

bot.command('ip', ip);

bot.command('about', (ctx) => {
  ctx.replyWithMarkdownV2(i18nRediction(ctx.i18n.t('about')), {
    disable_web_page_preview: true,
    reply_to_message_id: ctx.message.message_id,
  });
});

// DNS
bot.command('dns', dns);

bot
  .command('amydata', amydata)
  .command('ac', ac)
  .command('as', as);

// QR
bot.command('qrcode', qrcode);

// ID
bot.command('id', id);

// Rules
bot
  .command('addrule', addRule)
  .command('rulelist', ruleList)
  .command('delrule', delRule);

bot.settings(settings);

bot
  .action('lang', lang)
  .action('chinese', chinese)
  .action('english', english);

bot.action('nextpage', nextPage);
bot.action('lastpage', lastPage);

bot
  .action('back', back)
  .action('group', group)
  .action('addel', addel);

bot.on('my_chat_member', (ctx) => {
  if (ctx.update.my_chat_member.new_chat_member.user.id === Id && ctx.update.my_chat_member.new_chat_member.status === 'left') {
    new Rule(ctx.update.my_chat_member.chat.id).deleteAll();
  }
});

bot.on('message', message);

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
