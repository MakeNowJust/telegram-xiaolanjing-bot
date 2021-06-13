module.exports = (ctx) => {
  if (ctx.message.text.split(' ')[1]) {
  } else if (ctx.message.reply_to_message) {
    let extra = '';

    if (ctx.message.reply_to_message.document) extra = `*File*
File ID: \`${ctx.message.reply_to_message.document.file_id}\`
File unique ID: \`${ctx.message.reply_to_message.document.file_unique_id}\`
File size: \`${ctx.message.reply_to_message.document.file_size}\``;

    ctx.replyWithMarkdown(`*Message*
User ID: \`${ctx.from.id}\`
Group ID: \`${ctx.chat.id}\`
Message ID: \`${ctx.message.message_id}\`

${extra}`, { reply_to_message_id: ctx.message.message_id });
  } else {
    ctx.replyWithMarkdown(`Your ID: \`${ctx.from.id}\`
Group ID: \`${ctx.chat.id}\`
Message ID: \`${ctx.message.message_id}\``, { reply_to_message_id: ctx.message.message_id });
  }
}
