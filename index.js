const { Telegraf } = require('telegraf');
const TelegrafI18n = require('telegraf-i18n');
const LocalSession = require('telegraf-session-local');

const path = require('path');

const config = require('./config.js');

const addRule = require('./command/rule/addrule.js');
const ruleList = require('./command/rule/rulelist.js');
const delRule = require('./command/rule/delrule.js');
const id = require('./command/id.js');
const qrcode = require('./command/qrcode.js');
const amydata = require('./command/anonymous_chat/amydata.js');
const ac = require('./command/anonymous_chat/ac.js');
const as = require('./command/anonymous_chat/as.js');
const dns = require('./command/dns.js');
const ip = require('./command/ip.js');
const locale = require('./command/locale.js');

const message = require('./message.js');

const lastPage = require('./action/lastpage.js');
const nextPage = require('./action/nextpage.js');
const chinese = require('./action/chinese.js');
const english = require('./action/english.js');

const i18n = new TelegrafI18n({
  defaultLanguage: 'zh-hans',
  useSession: true,
  directory: path.resolve(process.cwd(), 'locales'),
})

const bot = new Telegraf(config.token);

bot.use((new LocalSession({ database: 'session.json' })).middleware());
bot.use(i18n.middleware());

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

bot.command('locale', locale);

bot.command('ip', ip);

bot.command('about', (ctx) => {
  ctx.replyWithMarkdown(i18nRediction(ctx.i18n.t('about')), {
    disable_web_page_preview: true,
    reply_to_message_id: ctx.message.message_id,
  });
});

// DNS
bot.command('dns', dns);

bot.command('amydata', amydata);
bot.command('ac', ac);
bot.command('as', as);

// QR
bot.command('qrcode', qrcode);

// ID
bot.command('id', id);

// Rules
bot.command('addrule', addRule);
bot.command('rulelist', ruleList);
bot.command('delrule', delRule);

bot.settings((ctx) => {
});

bot.action('chinese', chinese);
bot.action('english', english);

bot.action('nextpage', nextPage);
bot.action('lastpage', lastPage);

bot.on('message', message);

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
