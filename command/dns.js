const dns = require('dns');

const record = {
  'AAAA': 'AAAA',
  'CNAME': 'CNAME',
  'MX': 'MX',                                                           'NAPTR': 'NAPTR',
  'NS': 'NS',
  'PTR': 'PTR',
  'SOA': 'SOA',
  'SRV': 'SRV',
  'TXT': 'TXT'
};

module.exports = (ctx) => {
  let text = ctx.message.text.split(' ');

  if (text[1]) {
    dns.setServers([
      '1.1.1.1',
      '1.0.0.1'
    ]);

    ctx.reply(ctx.i18n.t('Querying'), { reply_to_message_id: ctx.message.message_id })
      .then((message) => {
        dns.resolve(text[1], record[text[2]] || 'A', (err, res) => {
          if (err) {
            ctx.telegram.editMessageText(
              message.chat.id,
              message.message_id,
              undefined,
              err.code
            );
          } else {
            text[3] = '1.1.1.1 DNS：\n';

            for (let i = 0; i < res.length; i++) {
              text[3] += `${res[i]}\n`;
            }

            ctx.telegram.editMessageText(message.chat.id, message.message_id, undefined, text[3]);
          }
        });
      });
  } else {
    ctx.replyWithMarkdown(ctx.i18n.t('DNSQueryHelp'), { reply_to_message_id: ctx.message.message_id });
  }
}
