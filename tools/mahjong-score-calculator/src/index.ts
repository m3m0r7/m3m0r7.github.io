import './Utilities/Utilities';
import { Mahjong } from "./Runtime/Mahjong";
import { PaiGenerator } from "./Utilities/PaiGenerator";

// torima
const mahjong = new Mahjong([
  "1m", "1m",
  "1m", "1m",
  "1m", "1m",

  // "3m", "3m",
  // "5m", "5m",
  //
  // "1p", "1p",
  // "3p", "3p",
  // "5p", "5p",
  //
  // "1s", "1s",


  // "1s", "2s", "3s",
  // "5z", "5z", "5z",
  // "6z", "6z", "6z",
  // "7z", "7z", "7z",
  // "2p", "3p", "4p",
  // "2p", "3p", "4p",
  // "2s", "3s", "4s",
  // "5s", "5s", "5s",
])

console.log(mahjong.score)

export default {}
