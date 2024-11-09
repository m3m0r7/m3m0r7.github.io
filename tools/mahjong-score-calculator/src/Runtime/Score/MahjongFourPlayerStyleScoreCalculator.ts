import { PaiPairCollection } from "../../Collection/Collection";
import { MahjongOption, ScoreCalculator, ScoreData } from "../../@types/types";
import { Mahjong } from "../Mahjong";
import { roundUpScore } from "./MahjongScore";
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

  static calculateParentAndChildScore(
    option: Partial<MahjongOption>,
    baseScore: number,
    additionalRoundScore: number,
    isParent: boolean,
  ) {
    if (option.hora?.fromTsumo) {
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
      MahjongFourPlayerStyleScoreCalculator.calculateParentAndChildScore(
        this.mahjong.option,
        baseScore,
        additionalRoundScore,
        isParent,
      ),
    );
  }
}
