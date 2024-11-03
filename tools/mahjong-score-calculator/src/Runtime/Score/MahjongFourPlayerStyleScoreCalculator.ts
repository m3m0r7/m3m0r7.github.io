import { MahjongFulfilledYakuValidator } from "../../Validator/MahjongFulfilledYakuValidator";
import { MahjongFulfilledFuValidator } from "../../Validator/MahjongFulfilledFuValidator";
import { PaiPairCollection } from "../../Collection/Collection";
import {
  CollectionAndScores,
  PaiFormat,
  PaiInfo, PaiName,
  Score,
  ScoreData,
  ScoreFu,
  ScoreTable,
  ScoreYaku
} from "../../@types/types";
import { Mahjong } from "../Mahjong";
import I18n from "../../Lang/I18n"
import { ChiiToitsu, KazoeYakuman, NagashiMangan, Pinfu } from "../../Yaku";
import { PaiPatternExtractor } from "../Extractor/Extractor";

export class MahjongFourPlayerStyleScoreCalculator {
  private paiPairCollections: PaiPairCollection[]
  private calculatedYakuAndFu: CollectionAndScores[]
  private mahjong: Mahjong
  private _scoreData: ScoreData | null = null
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
      .filter(collectionAndScores => collectionAndScores.scores.length > 0)
  }

  get isValid() {
    return this.score !== null
  }

  get score() {
    if (this._scoreData) {
      return this._scoreData
    }
    return this._scoreData = this.calculateScoreData(this.calculatedYakuAndFu)
  }

  private calculateYakuAndFu(collection: PaiPairCollection): CollectionAndScores {
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

    return { collection, scores }
  }

  private calculateScoreData(collectionAndScores: CollectionAndScores[]): ScoreData | null {
    let scoreData: Partial<ScoreData> | null = null;

    for (const collectionAndScore of collectionAndScores) {
      const yakuAndFu = collectionAndScore.scores
      if (! yakuAndFu.some(score => score.isYaku && (score.yaku.availableHora === undefined || score.yaku.availableHora))) {
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
              calculationBasedScore: score.yaku.calculationBasedHan ?? score.yaku.han,
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

      const isChiiToitsu = yakuAndFu.some(value => value.isYaku && value.yaku instanceof ChiiToitsu)

      // NOTE: The fu must be rounded up to the nearest one.
      //       And, in specially, calculate fu of the chiitoitsu.
      tempScoreData.fu = tempScoreData.fu <= 25 && isChiiToitsu
        ? tempScoreData.fu
        : Math.ceil(tempScoreData.fu / 10) * 10


      // NOTE: Here is specially mahjong rule.
      //       It is not available under 30 pu and 1 han.
      //       And so, 20 pu 1 han is only available the menzen-tsumo and the pinfu yaku, and/or chiitoitsu which is minimally 25 fu 1 han.
      //       Therefore, which is needed to round up to 30 pu 1 han minimally.
      if (tempScoreData.fu < 30 && ! (yakuAndFu.find(value => value.isYaku) instanceof Pinfu) && ! isChiiToitsu) {
        tempScoreData.fu = 30;
      }

      let calculationYaku: ScoreData['yaku'] = tempScoreData.appliedYakuList?.map(yaku => ! yaku.isYakuman && ! yaku.isDoubleYakuman && (yaku.calculationBasedScore ?? yaku.score)).sum() ?? 0
      tempScoreData.yaku = tempScoreData.appliedYakuList?.map(yaku => ! yaku.isYakuman && ! yaku.isDoubleYakuman && yaku.score).sum() ?? 0

      tempScoreData.yaku = tempScoreData.appliedYakuList?.some(yaku => yaku.isYakuman)
        ? calculationYaku = 'FULL'
        : tempScoreData.yaku

      tempScoreData.yaku = tempScoreData.appliedYakuList?.some(yaku => yaku.isDoubleYakuman)
        ? calculationYaku = 'DOUBLE_FULL'
        : tempScoreData.yaku

      tempScoreData.honba = this.mahjong.option.honba

      let baseScore = tempScoreData.honba * this.mahjong.option.localRules.honba;
      const isParent = this.mahjong.option.jikaze === '1z'
      const roundUpScore = (score: number): number => Math.ceil(score / 100) * 100

      if (calculationYaku !== 'DOUBLE_FULL' && calculationYaku !== 'FULL') {
        const kazoeYakuman = new KazoeYakuman(calculationYaku)

        if (kazoeYakuman.isFulfilled) {
          tempScoreData.appliedYakuList = [{
            isYakuman: true,
            isDoubleYakuman: false,
            isFu: false,
            name: I18n.ja.yaku[KazoeYakuman.name] ?? KazoeYakuman.name,
          }]

          calculationYaku = tempScoreData.yaku = kazoeYakuman.type !== 'NORMAL'
            ? kazoeYakuman.type
            : 13
        }
      }

      // NOTE: Here is a specially rules in mahjong, when this is available at ryu-kyoku (ryu-kyoku: End of a round but not fulfilled a yaku other/me players)
      const fulfilledNagashiMangan = yakuAndFu.find(value => value.isYaku && value.yaku instanceof NagashiMangan)
      if (fulfilledNagashiMangan && fulfilledNagashiMangan.isYaku) {
        tempScoreData.fu = null
        tempScoreData.appliedFuList = []
        tempScoreData.appliedYakuList = [{
          isYakuman: false,
          isDoubleYakuman: false,
          isFu: false,
          name: I18n.ja.yaku[NagashiMangan.name] ?? NagashiMangan.name,
          score: fulfilledNagashiMangan.yaku.han ?? 0,
          calculationBasedScore: fulfilledNagashiMangan.yaku.calculationBasedHan ?? fulfilledNagashiMangan.yaku.han,
        }]

        if (! tempScoreData.appliedYakuList[0].isFu && ! tempScoreData.appliedYakuList[0].isYakuman && ! tempScoreData.appliedYakuList[0].isDoubleYakuman) {
          tempScoreData.yaku = tempScoreData.appliedYakuList[0].score
          calculationYaku = tempScoreData.appliedYakuList[0].calculationBasedScore ?? 5
        }
      }

      if (calculationYaku === 'DOUBLE_FULL') { // NOTE: Double Yakuman
        baseScore += isParent ? 96000 : 64000;
        tempScoreData.fu = null
        tempScoreData.appliedFuList = []
      } else if (calculationYaku === 'FULL') { // NOTE: Yakuman
        baseScore += isParent ? 48000 : 32000;
        tempScoreData.fu = null
        tempScoreData.appliedFuList = []
      } else if (calculationYaku >= 11 && calculationYaku <= 12) { // NOTE: Normally scoring
        baseScore += isParent ? 36000 : 24000;
      } else if (calculationYaku >= 8 && calculationYaku <= 10) { // NOTE: Normally scoring
        baseScore += isParent ? 24000 : 16000;
      } else if (calculationYaku >= 6 && calculationYaku <= 7) { // NOTE: Normally scoring
        baseScore += isParent ? 18000 : 12000;
      } else if (calculationYaku >= 5) {
        baseScore += isParent ? 12000 : 8000;
      } else {  // NOTE: under 4 yaku
        baseScore += this.scoreTable?.[isParent ? 'parent' : 'child']?.[calculationYaku]?.[tempScoreData.fu ?? 30] ?? 0
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

      if (! scoreData || (tempScoreData?.score && scoreData.score?.base && tempScoreData.score.base > scoreData.score.base)) {
        scoreData = {
          ...tempScoreData,
          paiPatterns: collectionAndScore.collection.paiPairs.reduce<PaiFormat[]>((paiList, paiPair) => {
            paiList.push({
              ...paiPair,
              pattern: paiPair.pattern.map<PaiInfo>((paiName) => {
                const [number, group, option ] = PaiPatternExtractor.extractPaiPair(paiName)
                return {
                  ...option,
                  number: parseInt(number),
                  name: I18n.ja.pai[`${number}${group}` as PaiName].name,
                  group: I18n.ja.pai[`${number}${group}` as PaiName].groupName,
                }
              })
            })

            return paiList
          }, [])
        }
      }
    }

    if (!scoreData) {
      return null
    }

    return Object.assign<ScoreData, typeof scoreData>({
      score: { base: 0 },
      paiPatterns: [],
      fu: 0,
      yaku: 0,
      honba: 0,

      appliedFuList: [],
      appliedYakuList: [],
    }, scoreData)
  }
}
