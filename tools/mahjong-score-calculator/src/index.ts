import './Utilities/Utilities';
import { Mahjong } from "./Runtime/Mahjong";
import { PaiGenerator } from "./Utilities/PaiGenerator";

// torima

const mahjong = new Mahjong(
  [
    "1mf", "1m", "1m", "1m",
    "5mf", "5m", "5m", "5m",
    "3mf", "3m", "3m", "3m",
    "2p", "3p", "4p",

    "2s", "2s",
  ],
  {
    hora: {
      pai: "2s",
      fromTsumo: false,
      fromRon: true,

      fromRinshanPai: false,
    },

    jikaze: "2z",
    kaze: "1z",
  }).score

console.log(mahjong.fourPlayerStyleScore)

export default {}
