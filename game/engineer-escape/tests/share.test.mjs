import test from 'node:test';
import assert from 'node:assert/strict';
import { buildXShareUrl } from '../js/share.mjs';

test('クリア時間と日本語の話数を X の投稿画面へ渡す', () => {
  for (const time of ['00:00', '07:43', '125:09']) {
    const url = new URL(buildXShareUrl(time));
    assert.equal(url.origin + url.pathname, 'https://x.com/intent/post');
    assert.equal(url.searchParams.get('text'), `「リンクダウン」第1話を ${time} でクリア！\n#リンクダウン`);
    assert.equal(url.searchParams.get('url'), 'https://i.mem.ooo/game/engineer-escape/');
    assert.equal([...url.searchParams].length, 2);
  }
});
