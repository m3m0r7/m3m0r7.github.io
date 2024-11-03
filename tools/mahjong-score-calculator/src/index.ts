import "./Utilities/Utilities";
import { Mahjong } from "./Runtime/Mahjong";
import { PaiGenerator } from "./Utilities/PaiGenerator";
import { MahjongDefaultAdditionalSpecialYaku } from "./Runtime/MahjongDefaultOption";
import { PaiPatternExtractor } from "./Runtime/Extractor/Extractor";
import { PaiName } from "./@types/types";

// torima
//
// // // これを治す
const mahjong = new Mahjong(
  [
    // "1m", "2m", "3m",
    // "2m", "3m", "4m",
    // "3m", "4m", "5m",
    // "9m", "9m", "9m",
    //
    // "1m", "1m",

    "1m",
    "1m",
    "1m",
    "2m",
    "2m",
    "2m",
    "3m",
    "3m",
    "3m",
    "2p",
    "3p",
    "4p",

    "2s",
    "2s",

    // "1mf", "2m", "3m",
    // "4m", "5m", "6m",
    // "7m", "8m", "9m",
    // "2p", "3p", "4p",
    //
    // "2s", "2s",
  ],
  {
    hora: {
      pai: "2s",
      fromTsumo: false,
      fromRon: true,

      fromRinshanPai: false,
    },
    additionalSpecialYaku: {
      ...MahjongDefaultAdditionalSpecialYaku,
      withRiichi: true,
    },

    uraDoraList: ["2s"],

    jikaze: "2z",
    kaze: "1z",
  },
).score;

console.log(mahjong.fourPlayerStyleScore);

// console.log(PaiPatternExtractor.sortByPaiName(
//   [
//     "1m", "2m", "3m",
//     "2m", "3m", "4m",
//     "3m", "4m", "5m",
//     "9m", "9m", "9m",
//
//     "1m", "1m",
//   ], true));

//
// const a = [
//   "1m", "2m", "3m",
//   "2m", "3m", "4m",
//   "3m", "4m", "5m",
//   "9m", "1m", "9m", "1m", "9m",
//
//   "1m",
// ] as PaiName[];
//
// const result = PaiGenerator.generateShuntsuPatterns().reduce<{ original: PaiName[], sorted: PaiName[], pickedPositions: PaiName[] }>((carry, shuntsuPattern) => {
//   const result: PaiName[] = []
//   for (const v of [
//     PaiPatternExtractor.extractPaiPair(shuntsuPattern[0]),
//     PaiPatternExtractor.extractPaiPair(shuntsuPattern[1]),
//     PaiPatternExtractor.extractPaiPair(shuntsuPattern[2]),
//   ]) {
//     const [ number, group ] = v
//     for (let i = 0; i < carry.original.length; i++) {
//       if (!result.includes(i) && !carry.pickedPositions.includes(i) && carry.original[i] === `${number}${group}`) {
//         result.push(i)
//         break;
//       }
//     }
//   }
//
//   if (result.length === 3) {
//     carry.pickedPositions.push(...result)
//
//     carry.sorted.push(...result.map(v => carry.original[v]))
//   }
//
//   return carry
// }, { original: a, sorted: [], pickedPositions: [] })
//
// for (let i = 0; i < result.original.length; i++) {
//   if (result.pickedPositions.includes(i)) {
//     continue
//   }
//   result.sorted.push(result.original[i])
//   result.pickedPositions.push(i)
// }
//
// console.log(result)
//
// const t = PaiPatternExtractor.sortByPaiName([
//   "1m", "2m", "3m",
//   "2m", "3m", "4m",
//   "3m", "4m", "5m",
//   "9m", "1m", "9m", "1m", "9m",
//
// ], false)
//
export default {};
