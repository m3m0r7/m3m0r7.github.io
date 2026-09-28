export function buildXShareUrl(formattedTime) {
  const text = `「リンクダウン」第1話を ${formattedTime} でクリア！\n#リンクダウン`;
  const parameters = new URLSearchParams({ text, url: 'https://i.mem.ooo/game/engineer-escape/' });
  return `https://x.com/intent/post?${parameters}`;
}
