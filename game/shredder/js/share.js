export const X_SHARE_HASHTAG = "the_shredder";

export function buildXShareUrl({ levelName, totalCount, formattedTime, pageUrl }) {
  const text = `THE SHREDDER ${levelName} (${totalCount} ITEMS) を ${formattedTime} でクリア！\n#${X_SHARE_HASHTAG}`;
  const parameters = new URLSearchParams({ text, url: pageUrl });
  return `https://x.com/intent/post?${parameters}`;
}
