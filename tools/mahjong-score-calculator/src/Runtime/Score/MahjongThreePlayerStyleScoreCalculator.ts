import { PaiPairCollection } from "../../Collection/Collection";
import { MahjongOption, ScoreCalculator, ScoreData } from "../../@types/types";
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

  static calculateParentAndChildScore(
    option: Partial<MahjongOption>,
    baseScore: number,
    additionalRoundScore: number,
    isParent: boolean,
  ) {
    if (option.hora?.fromTsumo) {
      const tsumoZon =
        option.localRules?.threePlayStyle?.scoring === "DISCOUNTED_TSUMO";

      if (tsumoZon) {
        if (isParent) {
          const base = roundUpScore(baseScore / 3) * 2;
          const childScore = roundUpScore((baseScore / 4) * 2)
          return {
            base,
            child: childScore + additionalRoundScore,
          };
        } else {
          const base = roundUpScore(baseScore / 4 + (baseScore / 4) * 2);
          const childScore = base / 2
          return {
            base,
            parent: roundUpScore(baseScore / 2) + additionalRoundScore,
            child: roundUpScore(base / 2) + additionalRoundScore,
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
            parent: roundUpScore(baseScore / 2 + pePay) + additionalRoundScore,
            child: roundUpScore(baseScore / 4 + pePay) + additionalRoundScore,
          };
        }
      }
    }
    return {
      base: baseScore + additionalRoundScore,
    };
  }

  private calculateScoreData(): ScoreData | null {
    return new MahjongScoreCalculator(
      this.mahjong,
      this.paiPairCollections,
    ).calculate((baseScore, additionalRoundScore, isParent) =>
      MahjongThreePlayerStyleScoreCalculator.calculateParentAndChildScore(
        this.mahjong.option,
        baseScore,
        additionalRoundScore,
        isParent,
      ),
    );
  }
}
