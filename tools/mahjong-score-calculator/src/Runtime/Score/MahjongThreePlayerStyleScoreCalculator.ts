import { PaiPairCollection } from "../../Collection/Collection";
import {
  CollectionAndScores,
  ScoreCalculator,
  ScoreData,
} from "../../@types/types";
import { Mahjong } from "../Mahjong";
import { MahjongScoreCalculator } from "./MahjongScoreCalculator";
import { roundUpScore } from "./MahjongScore";

export class MahjongThreePlayerStyleScoreCalculator implements ScoreCalculator {
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
        const tsumoZon =
          this.mahjong.option.localRules.threePlayStyle.scoring ===
          "DISCOUNTED_TSUMO";

        console.log(tsumoZon);

        if (tsumoZon) {
          if (isParent) {
            const base = roundUpScore(baseScore / 3) * 2;
            return {
              base,
              child: roundUpScore(base / 2) + additionalRoundScore,
            };
          } else {
            const base = roundUpScore(baseScore / 4 + (baseScore / 4) * 2);
            return {
              base,
              parent: roundUpScore((baseScore / 4) * 2) + additionalRoundScore,
              child: roundUpScore(baseScore / 4) + additionalRoundScore,
            };
          }
        } else {
          const pePay = roundUpScore(baseScore / 4 / 2);

          if (isParent) {
            return {
              base: baseScore,
              child: roundUpScore(baseScore / 3 + pePay) + additionalRoundScore,
            };
          } else {
            return {
              base: baseScore,
              parent:
                roundUpScore(baseScore / 2 + pePay) + additionalRoundScore,
              child: roundUpScore(baseScore / 4 + pePay) + additionalRoundScore,
            };
          }
        }
      } else {
        return {
          base: baseScore + additionalRoundScore,
        };
      }
    });
  }
}
