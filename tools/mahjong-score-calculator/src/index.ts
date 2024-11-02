import './Utilities/Utilities';
import { Mahjong } from "./Runtime/Mahjong";
import { PaiGenerator } from "./Utilities/PaiGenerator";

// torima
const mahjong = new Mahjong([
  "2mf", "3m", "4m",
  "5m", "6m", "7m",

  "3p", "4p", "5pa",
  "6p", "7p", "8p",

  "2s", "2s",
])

console.log(mahjong.score)

export default {}
