// 間仕切りと家具の寸法は描画・当たり判定の共通値。
export const LOWER_Z_MAX = 9;
export const HOME_WALLS = [
  [-5,-1.6,.84,.96],
  [-2.66,-2.54,-.92,-.43],[-2.66,-2.54,.57,.9],
  [-5,-2.95,2.86,2.96],
  [-1.66,-1.54,.9,1.38],[-1.66,-1.54,2.56,9],
  [-5,-1.6,4.94,5.06],
];
export const HOME_DOORS = {
  'washroom-door':[-1.66,-1.54,1.38,2.56],
  'toilet-door':[-2.66,-2.54,-.43,.57],
  'bath-door':[-2.95,-1.66,2.86,2.96],
};
export const HOME_OPEN_DOORS={'toilet-door':[-3.66,-2.54,-.49,-.38]};
export function doorContains(id,point,padding=.22) {
  const r=HOME_DOORS[id];return point.feet<.4&&point.x>r[0]-padding&&point.x<r[1]+padding&&point.z>r[2]-padding&&point.z<r[3]+padding;
}
export const HOME_LOWER_FURNITURE = [
  [-4.80,-4.20,-1.93,-1.31],
  [-4.82,-3.74,-.4,.47],
  [-4.86,-4.12,1.18,2.38],[-3.4,-2.66,.97,1.7],[-2.5,-1.97,1.01,1.55],
  [-4.83,-3.46,3.17,4.87],
  [.5,2.9,5.825,6.975], [.12,2.84,8.18,8.97], [3.12,4.46,8.14,8.96],
  [1.04,2.88,-5,-3.82],[-1.075,.675,-4.78,-4.0],[1.94,2.7,-3.5,-2.9],[1.94,2.6,-2.6,-2],
];
export const HOME_UPPER_FURNITURE = [[-1.88,-.16,4.18,4.76],[3.59,4.17,3.89,4.61],[.55,2.25,2.75,4.87],[-.15,.46,4.13,4.82]];
export function homeLocation(player) {
  if(player.x>3&&Math.abs(player.z)<3.2)return null;
  if(player.feet>2.9)return player.x>.85&&player.z>2.5?'２階 / 寝室・仕事部屋':'２階 / 仕事部屋';
  if(player.feet>.2)return null;
  if(player.z>5&&player.x>-1.55)return '１階 / アイランドキッチン';
  if(player.x < -1.65 && player.z>2.96)return '１階 / 浴室';
  if(player.x < -1.65 && player.z>.96)return '１階 / 洗面脱衣所';
  if(player.x < -2.66 && player.z>-.92)return '１階 / トイレ';
  return null;
}
