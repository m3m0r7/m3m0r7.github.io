import './Utilities/Utilities';
import { Mahjong } from "./Runtime/Mahjong";
import { PaiGenerator } from "./Utilities/PaiGenerator";
import { MahjongDefaultAdditionalSpecialYaku } from "./Runtime/MahjongDefaultOption";

// torima

const mahjong = new Mahjong(
  [
    "1m", "2m", "3m",
    "5m", "6m", "7m",

    "3p", "4p", "5p",
    "6p", "7p", "8p",

    "2s", "2s",
  ],
  {
    hora: {
      pai: "1m",
      fromTsumo: false,
      fromRon: true,

      fromRinshanPai: false,
    },

    jikaze: "2z",
    kaze: "1z",
  }).score

console.log(mahjong.fourPlayerStyleScore)

export default {}
