import './Utilities/Utilities';
import { Mahjong } from "./Runtime/Mahjong";
import { PaiGenerator } from "./Utilities/PaiGenerator";

// torima

const mahjong = new Mahjong(
  [
    "1m", "2m", "3m",
    "7m", "8m", "9m",

    "1p", "2p", "3p",
    "7p", "8p", "9p",

    "1s", "1s",
  ],
  {
    hora: {
      pai: "1s",
      fromTsumo: false,
      fromRon: true,

      fromRinshanPai: false,
    },

    jikaze: "2z",
    kaze: "1z",
  }).score

console.log(mahjong.fourPlayerStyleScore)

export default {}
