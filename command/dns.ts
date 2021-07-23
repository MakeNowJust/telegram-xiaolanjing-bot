import * as dns from 'dns';

const record: object = {
  'AAAA': 'AAAA',
  'CNAME': 'CNAME',
  'MX': 'MX',
  'NAPTR': 'NAPTR',
  'NS': 'NS',
  'PTR': 'PTR',
  'SOA': 'SOA',
  'SRV': 'SRV',
  'TXT': 'TXT'
};

export default (ctx: any): void => {
  if (ctx.chat.type !== 'private') {
    ctx.reply(ctx.i18n.t('individual'), { reply_to_message_id: ctx.message.message_id });
    return;
  }

  let text = ctx.message.text.split(' ');

  if (text[1]) {
    dns.setServers([
      '1.1.1.1',
      '1.0.0.1'
    ]);

    ctx.replyWithChatAction('typing');

    dns.resolve(text[1], record[text[2]] || 'A', (err, res) => {
      if (err) {
        ctx.reply(err, { reply_to_message_id: ctx.message.message_id });
      } else {
        text[3] = '1.1.1.1 DNS：\n';

        for (let i = 0; i < res.length; i++) {
          text[3] += `${res[i]}\n`;
        }

        ctx.reply(text[3], { reply_to_message_id: ctx.message.message_id });
      }
    });
  } else {
    ctx.replyWithMarkdown(ctx.i18n.t('DNSQueryHelp'), { reply_to_message_id: ctx.message.message_id });
  }
}
