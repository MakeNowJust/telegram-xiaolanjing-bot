import { Telegraf } from 'telegraf';
import * as TelegrafI18n from 'telegraf-i18n';
import * as LocalSession from 'telegraf-session-local';

import * as path from 'path';

import config from './config';

import addRule from './command/rule/addrule';
import ruleList from './command/rule/rulelist';
import delRule from './command/rule/delrule';
import id from './command/id';
import qrcode from './command/qrcode';
import amydata from './command/alias_chat/amydata';
import ac from './command/alias_chat/ac';
import as from './command/alias_chat/as';
import dns from './command/dns';
import ip from './command/ip';
import settings from './command/settings';

import message from './message';

import Rule from './lib/rule';

import lang from './action/lang';
import lastPage from './action/lastpage';
import nextPage from './action/nextpage';
import chinese from './action/chinese';
import english from './action/english';
import back from './action/back';
import group from './action/group';
import addel from './action/addel';

import mAddel from './middleware/addel.js';

const i18n: any = new TelegrafI18n({
  defaultLanguage: 'zh-hans',
  useSession: true,
  directory: path.resolve(process.cwd(), 'locales')
});

const bot = new Telegraf(config.token);

const Id: number = Number(config.token.split(':')[0]);

bot.use((new LocalSession({ database: 'session.json' })).middleware());
bot.use(i18n.middleware());
bot.use(mAddel);

function i18nRediction(text: string): string {
  return text
    .replace(/\./g, '\\.')
    .replace(/-/g, '\\-');
}

bot.start((ctx: any) => {
  ctx.reply(ctx.i18n.t('start'), { reply_to_message_id: ctx.message.message_id });
});

bot.help((ctx: any) => {
  ctx.replyWithMarkdown(ctx.i18n.t('help'), { reply_to_message_id: ctx.message.message_id });
});

bot.command('ip', ip);

bot.command('about', (ctx: any) => {
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
