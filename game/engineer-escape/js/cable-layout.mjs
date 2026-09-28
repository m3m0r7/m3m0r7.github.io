export const CABLES = [
  ['usb-c', 'USB-C ケーブル', '#b7a78b', 'usb-c-male'],
  ['hdmi', 'HDMI ケーブル', '#596c85', 'hdmi-male'],
  ['power', '電源ケーブル', '#343b46', 'figure8-female'],
  ['usb-a', 'USB ケーブル', '#bb8c75', 'usb-a-male'],
  ['lan', 'LAN ケーブル', '#69c2b0', 'none'],
  ['audio', '音声ケーブル', '#aa9588', 'audio-jack'],
  ['display', '映像ケーブル', '#535765', 'hdmi-male'],
  ['charge', '充電ケーブル', '#c1bcb2', 'usb-c-male'],
  ['usb-extension', 'USB 延長ケーブル', '#798999', 'usb-a-male'],
  ['power-spare', '予備の電源ケーブル', '#47443f', 'figure8-female'],
];

export function createCableLayout() {
  return {
    junctions: [], cables: CABLES.map((_, i) => ({ id: i, strandIds: [i] })),
    strands: CABLES.map(([kind, name, color, connector], i) => ({
      id: i, cableId: i, typeKey: kind, typeLabel: name, pattern: 'mixed', radius: .07, color,
      roughness: .46, weight: 1.1, dragContactGrip: .24, dragPileFollow: 0, stiffness: .94, bendStiffness: .018,
      externalEnds: [true, true], connectors: kind.startsWith('power') ? ['power-plug', 'figure8-female'] : kind === 'usb-a' ? ['usb-a-male', 'usb-c-male'] : kind === 'usb-extension' ? ['usb-a-male', 'usb-a-female'] : [connector, connector], accessories: [],
      points: Array.from({ length: 48 }, (_, j) => {
        const t = j / 47, angle = (i - 4.5) * .48;
        const x = (t - .5) * 11.2, z = Math.sin(t * Math.PI * 2 + i * .17) * 2.8 + Math.sin(t * Math.PI * 4) * .45;
        return [x * Math.cos(angle) - z * Math.sin(angle) + (i - 4.5) * .12, .34 + i * .19, x * Math.sin(angle) + z * Math.cos(angle)];
      }),
    })),
  };
}
