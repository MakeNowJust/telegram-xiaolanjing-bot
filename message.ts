import Rule from './lib/rule';

import config from './config';

import fetch from 'node-fetch';

function messageReturn(results: object, ctx: any): void {
  if (results['return'].split(':')[0] === 'REPLY') {
    ctx.reply(results['return'].slice(results['return'].search(':') + 1), { reply_to_message_id: ctx.message.message_id });
  } else if (results['return'].split(':')[0] === 'DELETE') {
    ctx.deleteMessage();

    if (results['return'].split(':')[1]) {
      ctx.reply(results['return'].slice(results['return'].search(':') + 1));
    }
  }
}

export default async (ctx: any) => {
  if (['group', 'supergroup'].includes(ctx.chat.type)) {
    const list: any[] = await new Rule(ctx.chat.id).allRules();

    for (let i = 0; i < list.length; i++) {
      if (list[i].rule.split(':')[0] === 'MESSAGE') {
        if (new RegExp(list[i].rule.slice(list[i].rule.indexOf(':') + 1)).test(ctx.message.text)) {
          messageReturn(list[i], ctx);
          break;
        }
      }
    }
  } else if (ctx.message?.reply_to_message && ctx.chat.type === 'private' && String(ctx.message?.reply_to_message.from.id) === config.token.split(':')[0]) {
    const text: any = await fetch(encodeURI(`https://api.ownthink.com/bot?appid=&userid=&spoken=${ctx.message.text}`));
    const json: any = text.json();
    
    ctx.reply(json.data.info.text, { reply_to_message_id: ctx.message.message_id });

    if (json.data.info.heuristic) {
      ctx.reply(json.data.info.heuristic[0], { reply_to_message_id: ctx.message.message_id });
    }
  }
}
