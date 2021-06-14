const Rule = require('./lib/rule.js');
const detectAd = require('./lib/detect_ad.js');

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

async function shellRediction(text) {
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
    .replace(/🈵/g, '满')
    .replace(/🈴/g, '合')
    .replace(/🈶/g, '有');

  text = await fetch(`http://127.0.0.1:5000/corrector?text=${text}`)
  return text.text;
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

module.exports = (ctx) => {
  if (['group', 'supergroup'].includes(ctx.chat.type)) {
    new Rule(ctx.chat.id).allRules()
      .then((results) => {
        for (let i = 0; i < results.length; i++) {
          if (results[i].rule.split(':')[0] === 'MESSAGE') {
            if (new RegExp(regexpRediction(results[i].rule.slice(results[i].rule.indexOf(':') + 1))).test(ctx.message.text)) {
              messageReturn(results[i], ctx);
            }
          }

          if (results[i].rule.split(':')[0] === 'AD') {
            if (!ctx.message.text) continue;

            exec(`python -c "import re;re.sub('[a-zA-Z0-9_]+|\W', '', '${shellRediction(ctx.message.text)}')"`, (err, stdout) => {
              if (err) console.log(err);

              if (detectAd(sify(stdout))) {
                messageReturn(results[i], ctx);
              }
            });
          }
        }
      });
  } else if (ctx.message.reply_to_message && ctx.chat.type === 'private') {
    if (String(ctx.message.reply_to_message.from.id) === config.token.split(':')[0]) {
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
}
