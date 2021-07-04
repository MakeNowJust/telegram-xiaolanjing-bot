const Rule = require('./lib/rule.js');
const detectAd = require('./lib/detect_ad.js');

const config = require('./config.js');

const fetch = require('node-fetch');
const { sify } = require('chinese-conv');
const { exec } = require('child_process');

function rediction(text) {
  return text
    .replace(/\/_/g, '\\_')
    .replace(/\/%/g, '%')
    .replace(/\/'/g, '\'')
    .replace(/\/;/g, ';')
    .replace(/\/\[/g, '\\[')
    .replace(/\/\]/g, '\\]')
    .replace(/\/&/g, '&')
    .replace(/\/\//g, '\\/')
    .replace(/\/\(/g, '\\(')
    .replace(/\/\)/g, '\\)')
    .replace(/\./g, '\\.')
    .replace(/</g, '\\<')
    .replace(/>/g, '\\>')
    .replace(/\|/g, '\\|')
    .replace(/-/g, '\\-')
    .replace(/\\n/g, '\n');
}

function regexpRediction(text) {
  return text
    .replace(/\/_/g, '_')
    .replace(/\/%/g, '%')
    .replace(/\/'/g, '\'')
    .replace(/\/;/g, ';')
    .replace(/\/\[/g, '[')
    .replace(/\/\]/g, ']')
    .replace(/\/&/g, '&')
    .replace(/\/\//g, '/')
    .replace(/\/\(/g, '(')
    .replace(/\/\)/g, ')')
    .replace(/\./g, '.')
    .replace(/</g, '<')
    .replace(/>/g, '>');
}

function shellRediction(text) {
  text = text
    .replace(/[\+加][Vv]?[Xx信芯]?/g, '加微信')
    .replace(/\+[Qq][Qq]?/g, '加QQ')
    .replace(/"/g, '')
    .replace(/'/g, '')
    .replace(/\$/g, '')
    .replace(/\(/g, '')
    .replace(/\)/g, '')
    .replace(/_/g, '')
    .replace(/#/g, '')
    .replace(/\-/g, '')
    .replace(/\+/g, '')
    .replace(/\//g, '')
    .replace(/@/g, '')
    .replace(/:/g, '')
    .replace(/!/g, '')
    .replace(/\?/g, '')
    .replace(/;/g, '')
    .replace(/\n/g, '')
    .replace(/\*/g, '')
    .replace(/&/g, '')
    .replace(/%/g, '')
    .replace(/\[/g, '')
    .replace(/\]/g, '')
    .replace(/=/g, '')
    .replace(/\|/g, '')
    .replace(/{/g, '')
    .replace(/}/g, '')
    .replace(/~/g, '')
    .replace(/\s/g, '')
    .replace(/🈵/g, '满')
    .replace(/🈴/g, '合')
    .replace(/🈶/g, '有');

  return text;
}

function messageReturn(results, ctx, i) {
  if (results['return'].split(':')[0] === 'REPLY') {
    ctx.reply(rediction(results['return'].slice(results['return'].search(':') + 1)), { reply_to_message_id: ctx.message.message_id });
  } else if (results['return'].split(':')[0] === 'DELETE') {
    ctx.deleteMessage();

    if (results['return'].split(':')[1]) {
      ctx.reply(rediction(results['return'].slice(results['return'].search(':') + 1)));
    }
  } else if (results['return'].split(':')[0] === 'BAN') {
    ctx.kickChatMember(ctx.message.from.id, 0);

    if (results['return'].split(':')[1]) {
      ctx.reply(rediction(results['return'].slice(results['return'].search(':') + 1)));
    }
  }
}

module.exports = async (ctx) => {
  if (['group', 'supergroup'].includes(ctx.chat.type)) {
    const list = await new Rule(ctx.chat.id).allRules();

    for (let i = 0; i < list.length; i++) {
      if (list[i].rule.split(':')[0] === 'MESSAGE') {
        if (new RegExp(regexpRediction(list[i].rule.slice(list[i].rule.indexOf(':') + 1))).test(ctx.message.text)) {
          messageReturn(list[i], ctx);
          break;
        }
      }

      if (list[i].rule.split(':')[0] === 'AD' && ctx.message.from.id !== 777000) {
        if (!ctx.message.text) continue;

        exec(`python -c "import re;print(re.sub('[a-zA-Z0-9_]+|\W', '', '${shellRediction(ctx.message.text)}'))"`, async (err, stdout) => {
          if (err) console.log(err);

          const ok = await detectAd(sify(stdout));

          if (ok) {
            messageReturn(list[i], ctx);
          }
        });
      }
    }
  } else if (ctx.message?.reply_to_message && ctx.chat.type === 'private' && String(ctx.message?.reply_to_message.from.id) === config.token.split(':')[0]) {
    fetch(encodeURI(`https://api.ownthink.com/bot?appid=&userid=&spoken=${ctx.message.text}`))
      .then((res) => res.json())
      .then((json) => {
        ctx.reply(json.data.info.text, { reply_to_message_id: ctx.message.message_id });

        if (json.data.info.heuristic) {
          ctx.reply(json.data.info.heuristic[0], { reply_to_message_id: ctx.message.message_id });
        }
      });
  }
}
