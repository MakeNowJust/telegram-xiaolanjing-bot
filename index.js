const { Telegraf } = require('telegraf');
const fetch = require('node-fetch');
const dns = require('dns');
const QRCode = require('qrcode');
const chat = require('./lib/chat');

const bot = new Telegraf(''); /* 填写机器人的 API Token */

/**
 * 聊天服务。
 * @param {String} message 用户给机器人的消息。
 * @return {Object} 思知机器人的回复。
 */
async function getmessage(message) {
  let reply;
  await fetch(encodeURI(`https://api.ownthink.com/bot?appid=&userid=&spoken=${message}`))
    .then((res) => res.json())
    .then((json) => reply = json);
  return reply;
}

/**
 * 获取 IP 地址信息
 * @param {String} ip IP 地址。
 * @return {Object} ip.sb 返回的数据。
 */
async function geoip(ip) {
  let data;
  await fetch(encodeURI(`https://api.ip.sb/geoip/${ip}`)).then((res) => res.json()).then((json) => data = json);
  return data;
}

// start command
bot.command('start', (ctx) => {
  ctx.reply('我是一只超萌的小蓝鲸~', { reply_to_message_id: ctx.message.message_id });
});

bot.command('help', (ctx) => {
  ctx.reply(`所有命令：
/dns DNS 工具
/ip 查询 IP地址信息
/qrcode 生成二维码

*化名聊天室*
/amydata 获取数据
/ac 注册账号
/as 发送消息

/help 获取帮助
/about 关于我`,
  { parse_mode: 'Markdown', reply_to_message_id: ctx.message.message_id });
});

// 获取 IP地址信息 Start \\
bot.command('ip', (ctx) => {
  const text = ctx.message.text.split(' ');

  if (text[1]) {
    if (!text[1]
      .replace(/^127\.\d{1,3}\.\d{1,3}\.\d{1,3}$/, '')
      .replace(/^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/, '')
      .replace(/^192\.168\.\d{1,3}\.\d{1,3}$/, '')
      .replace(/^0\.\d{1,3}\.\d{1,3}\.\d{1,3}$/, '')
    ) {
      ctx.reply('您输入的 IP 地址不能查询哦！',
        { reply_to_message_id: ctx.message.message_id });
    } else if (text[1]
      .replace(/^[1-9]\d{0,2}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/, '')
    ) {
      ctx.reply('您输入的 IP 地址貌似有点问题？',
        { reply_to_message_id: ctx.message.message_id });
    } else {
      ctx.reply('正在查询中...',
        { reply_to_message_id: ctx.message.message_id }).then((a) => {
        geoip(text[1]).then((d) => {
          if (d.code) {
            ctx.telegram.editMessageText(
              a.chat.id,
              a.message_id,
              undefined,
              '请输入 IP 地址哦！',
            );
          } else {
            ctx.telegram.editMessageText(
              a.chat.id,
              a.message_id,
              undefined,
              `组织: ${d.organization ? d.organization : '未知'}
经度: ${d.longitude ? d.longitude : '未知'}
城市: ${d.city ? d.city : '未知'}
时区: ${d.timezone ? d.timezone : '未知'}
ISP: ${d.isp ? d.isp : '未知'}
地区: ${d.region ? d.region : '未知'}
ASN: ${d.asn ? d.asn : '未知'}
ASN 组织: ${d.asn_organization ? d.asn_organization : '未知'}
国家: ${d.country ? d.country : '未知'}
IP: ${d.ip ? d.ip : '未知'}`, { reply_to_message_id: ctx.message.message_id },
            );
          }
        });
      });
    }
  } else {
    ctx.reply(`使用方法：/ip IP地址
数据由 ip.sb 提供`, { reply_to_message_id: ctx.message.message_id });
  }
});

// 获取 IP地址信息 End \\

bot.command('about', (ctx) => {
  ctx.reply(`我的头像由[胖鲸](https://t.me/Superbigbig)设计。
我的程序由[厉害](https://t.me/lihai2333)编写，服务器也由他提供。

开源地址：https://github.com/lihai233333/telegram-xiaolanjing-bot

关注我的[官方频道](https://t.me/xiaolanjing)，获取我的开发进展。
`, {
    disable_web_page_preview: true,
    parse_mode: 'Markdown',
    reply_to_message_id: ctx.message.message_id,
  });
});

// DNS 工具 Start \\
bot.command('dns', (ctx) => {
  let text = ctx.message.text.split(' ');
  if (text[1]) {
    dns.setServers([
      '1.1.1.1',
      '1.0.0.1',
    ]);

    const rrtype = {
      A: true,
      AAAA: true,
      CNAME: true,
      MX: true,
      NS: true,
      NAPTR: true,
      PTR: true,
      SOA: true,
      SRV: true,
      TXT: true,
    };

    if (!rrtype[text[2]] && text[2]) {
      ctx.reply(`你填写的${text[2]}是啥鬼玩意？`, {
        reply_to_message_id: ctx.message.message_id,
      });
    } else {
      ctx.reply('正在查询中...', { reply_to_message_id: ctx.message.message_id })
        .then((c) => {
          dns.resolve(text[1], !text[2] ? 'A' : text[2], (err, a) => {
            if (err) {
              const error = {
                ENODATA: '没有数据',
                ESERVFAIL: '查询失败了！',
                ENOTFOUND: '未找到您要查询的信息！',
              };

              if (error[err.code]) {
                ctx.telegram.editMessageText(
                  c.chat.id,
                  c.message_id,
                  undefined,
                  error[err.code],
                );
              } else {
                ctx.telegram.editMessageText(
                  c.chat.id,
                  c.message_id,
                  undefined,
                  '出现了未知错误！',
                );
              }
              console.log(ctx.message.text, err);
            } else {
              const rrtype1 = text[2];
              text = '1.1.1.1 DNS：\n';
              for (let i = 0; i < a.length; i++) {
                text += `${a[i]}\n`;
              }

              if (!a.length) {
                text += `没有 ${rrtype1 || 'A'} 记录`;
              }

              ctx.telegram.editMessageText(c.chat.id, c.message_id, undefined, text);
            }
          });
        });
    }
  } else {
    text = '使用格式：/dns domain [rrtype，默认为 A 记录]';
    ctx.reply(text, { reply_to_message_id: ctx.message.message_id });
  }
});
// DNS 工具 End \\

// 化名聊天室 Start \\

// 获取账号数据 Start \\
bot.command('amydata', (ctx) => {
  if (ctx.chat.type === 'private') {
    ctx.reply('正在查询中...', { reply_to_message_id: ctx.message.message_id }).then((c) => {
      new chat().checkUser(String(ctx.message.from.id)).then((res) => {
        if (res.already) {
          ctx.telegram.editMessageText(c.chat.id, c.message_id, undefined, `代号：${res.cc}`);
        } else {
          ctx.telegram.editMessageText(c.chat.id, c.message_id, undefined, '很抱歉，您没有化名聊天室账号。');
        }
      });
    });
  } else {
    ctx.reply('很抱歉，此功能只能在私聊中使用。', { reply_to_message_id: ctx.message.message_id });
  }
});
// 获取账号数据 End \\

// 创建账号 Start \\
bot.command('ac', (ctx) => {
  if (ctx.chat.type === 'private') {
    const code = ctx.message.text.split(' ')[1];
    const userid = ctx.message.from.id;

    new chat().checkUser(String(userid)).then((res) => {
      if (!res.already) {
        if (code) {
          if (/^\w{1,20}$/i.test(code) && /^\d{9,}$/.test(userid)) {
            ctx.reply('正在注册中...', { reply_to_message_id: ctx.message.message_id }).then((a) => {
              // 注册
              new chat().touchUser(String(userid), code).then(() => {
                ctx.telegram.editMessageText(a.chat.id, a.message_id, undefined, '注册成功！');
                ctx.reply('*A*: 欢迎您注册小蓝鲸化名聊天室');
              });
            });
          } else {
            ctx.reply('您取的代号不符合 *1-20 个英文字母、下划线、数字* 的规范', { parse_mode: 'Markdown', reply_to_message_id: ctx.message.message_id });
          }
        } else {
          ctx.reply('注册方法：/ac 代号\n注册后代号目前再次无法更改，请慎重填写\n规范：1-20 个英文字母、下划线、数字', { reply_to_message_id: ctx.message.message_id });
        }
      } else {
        ctx.reply('您已经注册了账号了，还注册什么呀？', { reply_to_message_id: ctx.message.message_id });
      }
    });
  } else {
    ctx.reply('很抱歉，此功能只能在私聊中使用。', { reply_to_message_id: ctx.message.message_id });
  }
});
// 创建账号 End \\

// 发送消息 Start \\
bot.command('as', (ctx) => {
  if (ctx.chat.type === 'private') {
    const code = ctx.message.text.split(' ')[1];
    const msg = ctx.message.text.split(' ').slice(2);
    let message = '';

    for (let i = 0; i < msg.length; i++) {
      message += `${msg[i]} `;
    }

    const userid = ctx.message.from.id;

    if (code && (message || ctx.message.reply_to_message)) {
      if (/^\w{1,20}$/i.test(code) && /^\d{9,}$/.test(userid)) {
        new chat().checkUser(String(userid)).then((res) => {
          if (!res.already) {
            ctx.reply('您还没有化名聊天室账号！', { reply_to_message_id: ctx.message.message_id });
          } else {
            new chat().getId(code).then((ress) => {
              if (ress) {
                if (ctx.message.reply_to_message) {
                  ctx.copyMessage(ress, {
                    from_chat_id: ctx.chat.id,
                    message_id: ctx.message.reply_to_message.message_id,
                  }).then((a) => {
                    ctx.reply(`此消息由代号 ${res.cc} 用户发送`, {
                      chat_id: ress,
                      reply_to_message_id: a.message_id,
                    });
                  });

                  ctx.reply('消息已发送，如果对方没有启动过小蓝鲸，将不会收到消息。', { reply_to_message_id: ctx.message.message_id });
                } else {
                  ctx.telegram.sendMessage(ress, `*${res.cc}*: ${message}`, { parse_mode: 'Markdown' });
                  ctx.reply('消息已发送，如果对方没有启动过小蓝鲸，将不会收到消息。', { reply_to_message_id: ctx.message.message_id });
                }
              } else {
                ctx.reply(`代号为 ${code} 的用户不存在！`, { reply_to_message_id: ctx.message.message_id });
              }
            });
          }
        });
      } else {
        ctx.reply('您填写的代号不符合 *1-20 个英文字母、下划线、数字* 的规范', { parse_mode: 'Markdown', reply_to_message_id: ctx.message.message_id });
      }
    } else {
      ctx.reply('发送方法：/as 目标用户代号 消息', { reply_to_message_id: ctx.message.message_id });
    }
  } else {
    ctx.reply('很抱歉，此功能只能在私聊中使用。', { reply_to_message_id: ctx.message.message_id });
  }
});
// 发送消息 End \\

// 化名聊天室 End \\

// QR Start \\
bot.command('qrcode', (ctx) => {
  const content = ctx.message.text.split(' ').slice(1, -1);

  function version(number) {
    let v;

    if (String(Number(number)) !== 'NaN') {
      if ((number <= 40) && (number >= 1)) {
        v = number;
      }
    }

    return v;
  }

  function qr() {
    QRCode.toBuffer(content, { version: version(ctx.message.text.split(' ').slice(-1)) }, (_, uri) => {
      ctx.replyWithPhoto({
        source: uri,
      }, { reply_to_message_id: ctx.message.message_id });
    });
  }

  if (content.toString()) {
    if (!(ctx.chat.type === 'private')) {
      ctx.getChat().then((chat) => {
        if (chat.permissions.can_send_media_messages) {
          qr();
        } else {
          ctx.getChatMember(/* 填写机器人的 ID */).then((chatmember) => {
            if (chatmember.status === 'administrator') {
              qr();
            } else {
              ctx.reply('该群组默认不能发送媒体消息，请给我发送媒体消息的权限！');
            }
          });
        }
      });
    } else {
      qr();
    }
  } else {
    ctx.reply('使用方法：/qrcode 内容 版本1~40');
  }
});
// QR End \\

// 聊天 Start \\
bot.on('message', (ctx) => {
  if (ctx.message.reply_to_message) {
    if (ctx.message.reply_to_message.from.id === 942941243) {
      getmessage(ctx.message.text).then((d) => {
        ctx.reply(d.data.info.text, { reply_to_message_id: ctx.message.message_id });

        if (d.data.info.heuristic) ctx.reply(d.data.info.heuristic[0], { reply_to_message_id: ctx.message.message_id });
      });
    }
  }
});
// 聊天 End \\

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
