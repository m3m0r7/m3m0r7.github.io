export const createURL = (path: string) => {
  const url = `/tools/mahjong-score-calculator/${path}`;
  return (location.hostname === 'localhost' ? '/m3m0r7.github.io' : '') + url;
}
