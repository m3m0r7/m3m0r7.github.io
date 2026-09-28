import { hasLink, isOnline } from './state.mjs';

export function browserView(state, openingPhase = null) {
  if (openingPhase === 'loading') return { kind: 'loading', title: 'めもりーのホームページ', heading: 'ページを開いています…', description: 'i.mem.ooo からの応答を待っています。', code: 'CONNECTING…' };
  if (!openingPhase && !state.powerOn) return { kind: 'off', title: '', heading: '', description: '', code: '' };
  if (!openingPhase && isOnline(state)) return { kind: 'online', title: 'めもりーのホームページ', heading: 'おかえりなさい。', description: 'めもりーのホームページへようこそ。', code: 'HTTP 200 OK' };
  const code = openingPhase || !hasLink(state) ? 'ERR_INTERNET_DISCONNECTED' : !state.autoIP ? 'ERR_ADDRESS_UNREACHABLE' : 'ERR_NAME_NOT_RESOLVED';
  return {
    kind: 'error', title: 'サイトにアクセスできません', code,
    heading: code === 'ERR_NAME_NOT_RESOLVED' ? 'ホスト名を解決できません' : 'インターネットに接続されていません',
    description: 'このページを表示できませんでした。',
  };
}
