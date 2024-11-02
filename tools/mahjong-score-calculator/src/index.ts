import './Utilities/Utilities';
import { Mahjong } from "./Runtime/Mahjong";
import { PaiGenerator } from "./Utilities/PaiGenerator";

// torima
const mahjong = new Mahjong([

  "1mf", "1m", "1m",
  "9mf", "9m", "9m",
  "1pf", "1p", "1p",
  "9pf", "9p", "9p",

  "4z", "4z",
])

console.log(mahjong.score.fourPlayerStyleScore)

export default {}
