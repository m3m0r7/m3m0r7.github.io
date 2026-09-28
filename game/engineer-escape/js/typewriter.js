export function createTypewriter(node, prompt, onNext) {
  let text = '', letters = [], index = 0, timer, complete;
  function finish() {
    clearTimeout(timer); index = letters.length; node.textContent = text; node.dataset.typing = 'false';
    prompt.textContent = '次へ'; complete?.(); complete = null;
  }
  function tick() {
    node.textContent = letters.slice(0, ++index).join('');
    if (index >= letters.length) { finish(); return; }
    timer = setTimeout(tick, /[。、！？…]/.test(letters[index - 1]) ? 150 : 30);
  }
  return {
    show(value, onComplete) {
      clearTimeout(timer); text = value; letters = Array.from(value); index = 0; complete = onComplete;
      node.textContent = ''; node.dataset.typing = 'true'; prompt.textContent = '次へ';
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) finish(); else tick();
    },
    advance() { if (index < letters.length) finish(); else onNext(); },
    cancel() { clearTimeout(timer); complete = null; node.dataset.typing = 'false'; },
  };
}
