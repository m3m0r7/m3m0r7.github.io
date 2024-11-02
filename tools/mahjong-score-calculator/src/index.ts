import './Utilities/Utilities';
import { Mahjong } from "./Runtime/Mahjong";
import { PaiGenerator } from "./Utilities/PaiGenerator";

// torima
const mahjong = new Mahjong([

  "1m", "2m", "3m",
  "5m", "6m", "7m",

  "3p", "4p", "5p",
  "2z", "2z", "2z",

  "2s", "2s",
])

console.log(mahjong.score.fourPlayerStyleScore)

export default {}
