import { MahjongFulfilledYakuValidator } from "./Validator/MahjongFulfilledYakuValidator";
import { MahjongFulfilledFuValidator } from "./Validator/MahjongFulfilledFuValidator";
import { PaiPairCollection } from "./Collection";
import { Score, ScoreData, ScoreFu, ScoreYaku } from "./types";
import { Mahjong } from "./Mahjong";
import I18n from "./I18n"

type ScoreTable = Record<number, Record<number, number>>

export class MahjongScoreCalculator {
  private paiPairCollections: PaiPairCollection[]
  private calculatedYakuAndFu: Score[][]
  private mahjong: Mahjong
  private _scoreData: ScoreData | null
  private scoreTable: { parent: ScoreTable, child: ScoreTable } = {
    parent: {
      1: {           30: 1500, 40: 2000, 50: 2400, 60: 2900, 70: 3400, 80: 3900, 90: 4400, 100: 4800, 110: 5300 },
      2: { 25: 2400, 30: 2900, 40: 3900, 50: 4800, 60: 5800, 70: 6800, 80: 7700, 90: 8700, 100: 9600, 110: 10600 },
      3: { 25: 4800, 30: 5800, 40: 7700, 50: 9600, 60: 11600, 70: 12000, 80: 12000, 90: 12000, 100: 12000, 110: 12000 },
      4: { 25: 9600, 30: 11600, 40: 12000, 50: 12000, 60: 12000, 70: 12000, 80: 12000, 90: 12000, 100: 12000, 110: 12000 },
    },
    child: {
      1: {           30: 1000, 40: 1300, 50: 1600, 60: 2000, 70: 2300, 80: 2600, 90: 2900, 100: 3200, 110: 3600 },
      2: { 25: 1600, 30: 2000, 40: 2600, 50: 3200, 60: 3900, 70: 4500, 80: 5200, 90: 5800, 100: 6400, 110: 7100 },
      3: { 25: 3200, 30: 3900, 40: 5200, 50: 6400, 60: 7700, 70: 8000, 80: 8000, 90: 8000, 100: 8000, 110: 8000 },
      4: { 25: 6400, 30: 7700, 40: 8000, 50: 8000, 60: 8000, 70: 8000, 80: 8000, 90: 8000, 100: 8000, 110: 8000 },
    },
  }

  constructor(mahjong: Mahjong, paiPairCollections: PaiPairCollection[]) {
    this.mahjong = mahjong
    this.paiPairCollections = paiPairCollections;
    this.calculatedYakuAndFu = this.paiPairCollections.map(collection => this.calculateYakuAndFu(collection))
      .filter(score => score.length > 0)

    this._scoreData = this.calculateScoreData(this.calculatedYakuAndFu)
  }

  get scoreData(): ScoreData | null {
    return this._scoreData
  }

  get isValid() {
    return this.scoreData !== null
  }

  private calculateYakuAndFu(collection: PaiPairCollection): Score[] {
    const scores: Score[] = []
    const yakuValidator = new MahjongFulfilledYakuValidator(collection, this.mahjong.option);

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

  private calculateScoreData(yakuAndFuList: Score[][]): ScoreData | null {
    let scoreData: Partial<ScoreData> | null = null;

    for (const yakuAndFu of yakuAndFuList) {
      if (!yakuAndFu.some(score => score.isYaku && score.yaku.availableHora)) {
        continue;
      }

      const tempScoreData = yakuAndFu.reduce<Partial<ScoreData>>((carry, score) => {
        if (score.isYaku) {
          if (score.yaku.type === 'FULL') {
            carry.appliedYakuList?.push({
              isYakuman: true,
              isDoubleYakuman: false,
              isFu: false,
              name: I18n.ja.yaku[score.yaku.constructor.name] ?? score.yaku.constructor.name,
            })
          } else if (score.yaku.type === 'DOUBLE_FULL') {
            carry.appliedYakuList?.push({
              isYakuman: false,
              isDoubleYakuman: true,
              isFu: false,
              name: I18n.ja.yaku[score.yaku.constructor.name] ?? score.yaku.constructor.name,
            })
          } else {
            carry.appliedYakuList?.push({
              isYakuman: false,
              isDoubleYakuman: false,
              isFu: false,
              name: I18n.ja.yaku[score.yaku.constructor.name] ?? score.yaku.constructor.name,
              score: score.yaku.han ?? 0,
            })
          }
        } else {
          carry.appliedFuList?.push({
            isYakuman: false,
            isDoubleYakuman: false,
            isFu: true,
            name: I18n.ja.fu[score.fu.constructor.name] ?? score.fu.constructor.name,
            score: score.fu.value,
          })
        }
        return carry
      }, {
        appliedFuList: [],
        appliedYakuList: [],
      });

      tempScoreData.fu = tempScoreData.appliedFuList?.map(fu => fu.isFu && fu.score).sum() ?? 0

      // NOTE: The fu must be rounded up to the nearest one
      tempScoreData.fu = tempScoreData.fu === 25
        ? tempScoreData.fu
        : Math.ceil(tempScoreData.fu / 10) * 10

      tempScoreData.yaku = tempScoreData.appliedYakuList?.map(yaku => !yaku.isYakuman && !yaku.isDoubleYakuman && yaku.score).sum() ?? 0
      tempScoreData.yaku = tempScoreData.appliedYakuList?.some(yaku => yaku.isYakuman)
        ? 'FULL'
        : tempScoreData.yaku

      tempScoreData.yaku = tempScoreData.appliedYakuList?.some(yaku => yaku.isDoubleYakuman)
        ? 'DOUBLE_FULL'
        : tempScoreData.yaku

      tempScoreData.honba = this.mahjong.option.honba

      let baseScore = tempScoreData.honba * this.mahjong.option.localRules.honba;
      const isParent = this.mahjong.option.jikaze === '1z'
      const roundUpScore = (score: number): number => Math.ceil(score / 100) * 100

      if (tempScoreData.yaku === 'DOUBLE_FULL') { // NOTE: Double Yakuman
        baseScore = isParent ? 64000 : 48000;
        tempScoreData.fu = null
      } else if (tempScoreData.yaku === 'FULL') { // NOTE: Yakuman
        baseScore = isParent ? 48000 : 32000;
        tempScoreData.fu = null
      } else if (tempScoreData.yaku >= 11 && tempScoreData.yaku <= 12) { // NOTE: Normally scoring
        baseScore += isParent ? 36000 : 24000;
      } else if (tempScoreData.yaku >= 8 && tempScoreData.yaku <= 10) { // NOTE: Normally scoring
        baseScore += isParent ? 24000 : 16000;
      } else if (tempScoreData.yaku >= 6 && tempScoreData.yaku <= 7) { // NOTE: Normally scoring
        baseScore += isParent ? 18000 : 12000;
      } else if (tempScoreData.yaku >= 5) {
        baseScore += isParent ? 12000 : 8000;
      } else {  // NOTE: under 4 yaku
        baseScore += this.scoreTable?.[isParent ? 'parent' : 'child']?.[tempScoreData.yaku]?.[tempScoreData.fu] ?? 0
      }

      if (this.mahjong.option.hora.fromTsumo) {
        if (isParent) {
          tempScoreData.score = {
            base: baseScore,
            child: roundUpScore(baseScore / 3),
          }
        } else {
          tempScoreData.score = {
            base: baseScore,
            parent: roundUpScore(baseScore / 2),
            child: roundUpScore(baseScore / 4),
          }
        }
      } else {
        tempScoreData.score = {
          base: baseScore,
        }
      }

      if (!scoreData || (tempScoreData.score && scoreData.score && tempScoreData.score > scoreData.score)) {
        scoreData = tempScoreData
      }
    }

    console.log(scoreData);

    if (!scoreData) {
      return null
    }

    return Object.assign<ScoreData, typeof scoreData>({
      score: { base: 0 },
      fu: 0,
      yaku: 0,
      honba: 0,
      appliedFuList: [],
      appliedYakuList: [],
    }, scoreData)
  }
}
