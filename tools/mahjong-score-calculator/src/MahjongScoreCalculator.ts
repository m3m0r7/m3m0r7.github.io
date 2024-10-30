import { MahjongFulfilledYakuValidator } from "./Validator/MahjongFulfilledYakuValidator";
import { MahjongFulfilledFuValidator } from "./Validator/MahjongFulfilledFuValidator";
import { PaiPairCollection } from "./Collection";
import { Score, ScoreFu, ScoreYaku } from "./types";
import { Mahjong } from "./Mahjong";

export class MahjongScoreCalculator {
  private paiPairCollections: PaiPairCollection[]
  private scores: Score[][]
  private mahjong: Mahjong

  constructor(mahjong: Mahjong, paiPairCollections: PaiPairCollection[]) {
    this.mahjong = mahjong
    this.paiPairCollections = paiPairCollections;
    this.scores = this.paiPairCollections.map(collection => this.calculateScore(collection))

    console.log(this.scores);
  }

  get isValid() {
    return this.scores.some(scores => scores.length > 0)
  }

  private calculateScore(collection: PaiPairCollection): Score[] {
    const scores: Score[] = []
    const yakuValidator = new MahjongFulfilledYakuValidator(collection);

    if (yakuValidator.validate()) {
      scores.push(...yakuValidator.fulfilled.map<ScoreYaku>(yaku => ({
        isYaku: true,
        yaku,
      })))
    }

    const fuValidator = new MahjongFulfilledFuValidator(
      collection,
      yakuValidator.fulfilled,
      this.mahjong.option,
    );

    if (fuValidator.validate()) {
      scores.push(...fuValidator.fulfilled.map<ScoreFu>(fu => ({
        isYaku: false,
        fu,
      })))
    }

    return scores
  }

}
