import { MahjongFulfilledYakuValidator } from "../../Validator/MahjongFulfilledYakuValidator";
import { MahjongFulfilledFuValidator } from "../../Validator/MahjongFulfilledFuValidator";
import { PaiPairCollection } from "../../Collection/Collection";
import {
  CollectionAndScores,
  PaiFormat,
  PaiInfo,
  PaiName,
  Score,
  ScoreCalculator,
  ScoreData,
  ScoreFu,
  ScoreTable,
  ScoreYaku,
} from "../../@types/types";
import { Mahjong } from "../Mahjong";
import I18n from "../../Lang/I18n";
import {
  ChiiToitsu,
  KazoeYakuman,
  NagashiMangan,
  PaRenChan,
  Pinfu,
} from "../../Yaku";
import { PaiPatternExtractor } from "../Extractor/Extractor";
import { scoreTable, roundUpScore } from "./MahjongScore";
import { MahjongScoreCalculator } from "./MahjongScoreCalculator";

export class MahjongFourPlayerStyleScoreCalculator implements ScoreCalculator {
  private paiPairCollections: PaiPairCollection[];
  private mahjong: Mahjong;
  private _scoreData: ScoreData | null = null;

  constructor(mahjong: Mahjong, paiPairCollections: PaiPairCollection[]) {
    this.mahjong = mahjong;
    this.paiPairCollections = paiPairCollections;
  }

  get isValid() {
    return this.score !== null;
  }

  get score() {
    if (this._scoreData) {
      return this._scoreData;
    }
    return (this._scoreData = this.calculateScoreData());
  }

  private calculateScoreData(): ScoreData | null {
    return new MahjongScoreCalculator(
      this.mahjong,
      this.paiPairCollections,
    ).calculate((baseScore, additionalRoundScore, isParent) => {
      if (this.mahjong.option.hora.fromTsumo) {
        if (isParent) {
          return {
            base: baseScore,
            child: roundUpScore(baseScore / 3) + additionalRoundScore,
          };
        } else {
          return {
            base: baseScore,
            parent: roundUpScore(baseScore / 2) + additionalRoundScore,
            child: roundUpScore(baseScore / 4) + additionalRoundScore,
          };
        }
      } else {
        return {
          base: baseScore + additionalRoundScore,
        };
      }
    });
  }
}
