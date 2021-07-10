import Settings from './../lib/settings';
import { exec } from 'child_process';
import { sify } from 'chinese-conv';
import detectAd from './../lib/detect_ad';

function shellRediction(text: string): string {
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

export default async (ctx: any, next: any) => {
  if (ctx.chat.type === 'private' || ctx?.message.text === undefined) {
    await next();
    return;
  }

  await next();

  const k: any = await new Settings(ctx.chat.id).getS();

  if (k.addel === false) {
    return;
  }

  exec(`python -c "import re;print(re.sub('[a-zA-Z0-9_]+|\W', '', '${shellRediction(ctx.message.text)}'))"`, async (err, stdout) => {
    if (err) {
      console.error(err);
    }

    const ok: boolean = await detectAd(sify(stdout));

    if (ok) {
      ctx.deleteMessage();
    }
  });
}
