import { hydrateIcons } from './icons.js';
hydrateIcons();
try {
  const { startGame } = await import('./game.js');
  await document.fonts.ready;
  await startGame();
} catch (error) {
  console.error('ゲームの初期化に失敗しました。', error);
  document.querySelectorAll('dialog[open]').forEach(dialog => dialog.close());
  document.getElementById('loading').hidden = true;
  document.getElementById('load-error').hidden = false;
}
