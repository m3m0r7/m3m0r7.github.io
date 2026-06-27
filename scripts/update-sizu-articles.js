const fs = require('node:fs/promises');

const USERNAME = 'memory';
const RSS_URL = `https://sizu.me/${USERNAME}/rss`;

const decodeXml = (value) => value
  .replace(/<!\[CDATA\[(.*?)\]\]>/gs, '$1')
  .replace(/&amp;/g, '&')
  .replace(/&lt;/g, '<')
  .replace(/&gt;/g, '>')
  .replace(/&quot;/g, '"')
  .replace(/&#39;/g, "'");

const contentOf = (source, tag) => {
  const match = source.match(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`));
  return match ? decodeXml(match[1]).trim() : '';
};

const fetchText = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
  }
  return response.text();
};

const parsePostPage = async (url) => {
  const html = await fetchText(url);
  const match = html.match(/<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/);
  if (!match) {
    throw new Error(`Failed to find __NEXT_DATA__ in ${url}`);
  }

  const data = JSON.parse(match[1]);
  const pageProps = data.props.pageProps;
  return {
    post: pageProps.post,
    tags: pageProps.tags || [],
  };
};

const main = async () => {
  const rss = await fetchText(RSS_URL);
  const items = [...rss.matchAll(/<item>([\s\S]*?)<\/item>/g)].map(match => match[1]);
  const posts = [];

  for (const item of items) {
    const link = contentOf(item, 'link');
    const fallbackTitle = contentOf(item, 'title');
    const pubDate = contentOf(item, 'pubDate');
    const slug = link.split('/').filter(Boolean).pop();
    const { post, tags } = await parsePostPage(link);

    posts.push({
      slug: post.slug || slug,
      title: post.title || fallbackTitle,
      bodyCharacterCount: post.bodyCharacterCount || 0,
      visibility: post.visibility || 'ANYONE',
      tags: tags.map(tag => tag.name || tag.label || tag),
      createdAt: (post.firstPublishedAt && post.firstPublishedAt.iso) || new Date(pubDate).toISOString(),
      updatedAt: (post.bodyUpdatedAt && post.bodyUpdatedAt.iso) || (post.createdAt && post.createdAt.iso) || new Date(pubDate).toISOString(),
    });
  }

  const payload = {
    posts,
    pagination: {
      currentPage: 1,
      nextPage: null,
      prevPage: null,
      perPage: posts.length,
      sort: 'created',
      direction: 'desc',
    },
  };

  await fs.writeFile('articles.json', JSON.stringify(payload), 'utf8');
};

main().catch(error => {
  console.error(error);
  process.exit(1);
});
