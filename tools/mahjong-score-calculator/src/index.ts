import './Utilities/Utilities';
import { Mahjong } from "./Runtime/Mahjong";
import { PaiGenerator } from "./Utilities/PaiGenerator";

// torima
const mahjong = new Mahjong([

  "1m", "1m", "1m",
  "2m", "2m", "2m",
  "3m", "3m", "3m",
  "2p", "3p", "4p",

  "2s", "2s",
])

console.log(mahjong.score.fourPlayerStyleScore)

export default {}
