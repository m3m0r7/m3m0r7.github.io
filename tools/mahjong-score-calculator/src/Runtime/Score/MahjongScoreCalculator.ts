import { MahjongFulfilledYakuValidator } from "../../Validator/MahjongFulfilledYakuValidator";
import { MahjongFulfilledFuValidator } from "../../Validator/MahjongFulfilledFuValidator";
import { PaiPairCollection } from "../../Collection/Collection";
import {
  CollectionAndScores,
  PaiFormat,
  PaiInfo,
  PaiName,
  Score,
  ScoreData,
  ScoreFu,
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
import { calculateScore } from "./MahjongScore";

export class MahjongScoreCalculator {
  private paiPairCollections: PaiPairCollection[];
  private calculatedYakuAndFu: CollectionAndScores[];
  private mahjong: Mahjong;
  private _scoreData: ScoreData | null = null;

  constructor(mahjong: Mahjong, paiPairCollections: PaiPairCollection[]) {
    this.mahjong = mahjong;
    this.paiPairCollections = paiPairCollections;
    this.calculatedYakuAndFu = this.paiPairCollections
      .map((collection) => this.calculateYakuAndFu(collection))
      .filter((collectionAndScores) => collectionAndScores.scores.length > 0);
  }

  private calculateYakuAndFu(
    collection: PaiPairCollection,
  ): CollectionAndScores {
    const scores: Score[] = [];
    const yakuValidator = new MahjongFulfilledYakuValidator(
      collection,
      this.mahjong.option,
    );

    if (yakuValidator.validate()) {
      scores.push(
        ...yakuValidator.fulfilled.map<ScoreYaku>((yaku) => ({
          isYaku: true,
          yaku,
        })),
      );
    }

    const fuValidator = new MahjongFulfilledFuValidator(
      collection,
      yakuValidator.fulfilled,
      this.mahjong.option,
    );

    if (fuValidator.validate()) {
      scores.push(
        ...fuValidator.fulfilled.map<ScoreFu>((fu) => ({
          isYaku: false,
          fu,
        })),
      );
    }

    return { collection, scores };
  }

  calculate(
    calculator: (
      baseScore: number,
      additionalRoundScore: number,
      isParent: boolean,
    ) => ScoreData["score"],
  ): ScoreData | null {
    const collectionAndScores: CollectionAndScores[] = this.calculatedYakuAndFu;

    let scoreData: Partial<ScoreData> | null = null;

    for (const collectionAndScore of collectionAndScores) {
      const yakuAndFu = collectionAndScore.scores;
      if (
        !yakuAndFu.some(
          (score) =>
            score.isYaku &&
            (score.yaku.availableHora === undefined ||
              score.yaku.availableHora),
        )
      ) {
        continue;
      }

      const tempScoreData = yakuAndFu.reduce<Partial<ScoreData>>(
        (carry, score) => {
          if (score.isYaku) {
            if (score.yaku.type === "FULL") {
              carry.appliedYakuList?.push({
                isYakuman: true,
                isDoubleYakuman: false,
                isFu: false,
                name:
                  I18n.ja.yaku[score.yaku.constructor.name] ??
                  score.yaku.constructor.name,
              });
            } else if (score.yaku.type === "DOUBLE_FULL") {
              carry.appliedYakuList?.push({
                isYakuman: false,
                isDoubleYakuman: true,
                isFu: false,
                name:
                  I18n.ja.yaku[score.yaku.constructor.name] ??
                  score.yaku.constructor.name,
              });
            } else {
              carry.appliedYakuList?.push({
                isYakuman: false,
                isDoubleYakuman: false,
                isFu: false,
                name:
                  I18n.ja.yaku[score.yaku.constructor.name] ??
                  score.yaku.constructor.name,
                score: score.yaku.han ?? 0,
                calculationBasedScore:
                  score.yaku.calculationBasedHan ?? score.yaku.han,
              });
            }
          } else {
            carry.appliedFuList?.push({
              isYakuman: false,
              isDoubleYakuman: false,
              isFu: true,
              name:
                I18n.ja.fu[score.fu.constructor.name] ??
                score.fu.constructor.name,
              score: score.fu.value,
            });
          }

          return carry;
        },
        {
          appliedFuList: [],
          appliedYakuList: [],
        },
      );
      tempScoreData.fu =
        tempScoreData.appliedFuList?.map((fu) => fu.isFu && fu.score).sum() ??
        0;

      const isChiiToitsu = yakuAndFu.some(
        (value) => value.isYaku && value.yaku instanceof ChiiToitsu,
      );

      // NOTE: The fu must be rounded up to the nearest one.
      //       And, in specially, calculate fu of the chiitoitsu.
      tempScoreData.fu =
        tempScoreData.fu <= 25 && isChiiToitsu
          ? tempScoreData.fu
          : Math.ceil(tempScoreData.fu / 10) * 10;

      // NOTE: Here is specially mahjong rule.
      //       It is not available under 30 pu and 1 han.
      //       And so, 20 pu 1 han is only available the menzen-tsumo and the pinfu yaku, and/or chiitoitsu which is minimally 25 fu 1 han.
      //       Therefore, which is needed to round up to 30 pu 1 han minimally.
      if (
        tempScoreData.fu < 30 &&
        !(yakuAndFu.find((value) => value.isYaku) instanceof Pinfu) &&
        !isChiiToitsu
      ) {
        tempScoreData.fu = 30;
      }

      let calculationYaku: ScoreData["yaku"] =
        tempScoreData.appliedYakuList
          ?.map(
            (yaku) =>
              !yaku.isYakuman &&
              !yaku.isDoubleYakuman &&
              (yaku.calculationBasedScore ?? yaku.score),
          )
          .sum() ?? 0;
      tempScoreData.yaku =
        tempScoreData.appliedYakuList
          ?.map(
            (yaku) => !yaku.isYakuman && !yaku.isDoubleYakuman && yaku.score,
          )
          .sum() ?? 0;

      tempScoreData.yaku = tempScoreData.appliedYakuList?.some(
        (yaku) => yaku.isYakuman,
      )
        ? (calculationYaku = "FULL")
        : tempScoreData.yaku;

      tempScoreData.yaku = tempScoreData.appliedYakuList?.some(
        (yaku) => yaku.isDoubleYakuman,
      )
        ? (calculationYaku = "DOUBLE_FULL")
        : tempScoreData.yaku;

      tempScoreData.honba = this.mahjong.option.honba;

      const isParent = this.mahjong.option.jikaze === "1z";

      if (calculationYaku !== "DOUBLE_FULL" && calculationYaku !== "FULL") {
        const kazoeYakuman = new KazoeYakuman(calculationYaku);

        if (kazoeYakuman.isFulfilled) {
          tempScoreData.appliedYakuList = [
            {
              isYakuman: true,
              isDoubleYakuman: false,
              isFu: false,
              name: I18n.ja.yaku[KazoeYakuman.name] ?? KazoeYakuman.name,
            },
          ];

          calculationYaku = tempScoreData.yaku =
            kazoeYakuman.type !== "NORMAL" ? kazoeYakuman.type : 13;
        }
      }

      // NOTE: Here is a specially rules in mahjong, when this is available at ryu-kyoku (ryu-kyoku: End of a round but not fulfilled a yaku other/me players)
      const fulfilledNagashiMangan = yakuAndFu.find(
        (value) => value.isYaku && value.yaku instanceof NagashiMangan,
      );
      if (fulfilledNagashiMangan && fulfilledNagashiMangan.isYaku) {
        tempScoreData.fu = null;
        tempScoreData.appliedFuList = [];
        tempScoreData.appliedYakuList = [
          {
            isYakuman: false,
            isDoubleYakuman: false,
            isFu: false,
            name: I18n.ja.yaku[NagashiMangan.name] ?? NagashiMangan.name,
            score: fulfilledNagashiMangan.yaku.han ?? 0,
            calculationBasedScore:
              fulfilledNagashiMangan.yaku.calculationBasedHan ??
              fulfilledNagashiMangan.yaku.han,
          },
        ];

        if (
          !tempScoreData.appliedYakuList[0].isFu &&
          !tempScoreData.appliedYakuList[0].isYakuman &&
          !tempScoreData.appliedYakuList[0].isDoubleYakuman
        ) {
          tempScoreData.yaku = tempScoreData.appliedYakuList[0].score;
          calculationYaku =
            tempScoreData.appliedYakuList[0].calculationBasedScore ?? 5;
        }
      }

      // NOTE: The PaRenChan yaku is not add additional round score
      const additionalRoundScore = yakuAndFu.find(
        (value) => value.isYaku && value.yaku instanceof PaRenChan,
      )
        ? 0
        : tempScoreData.honba * this.mahjong.option.localRules.honba;

      const [yakuType, baseScore] = calculateScore(
        tempScoreData.fu,
        calculationYaku,
        isParent,
      );

      tempScoreData.yakuType = yakuType;
      if (yakuType !== "NORMAL") {
        tempScoreData.fu = null;
        tempScoreData.appliedFuList = [];
      }

      tempScoreData.score = calculator(
        baseScore,
        additionalRoundScore,
        isParent,
      );

      if (
        !scoreData ||
        (tempScoreData?.score &&
          scoreData.score?.base &&
          tempScoreData.score.base > scoreData.score.base)
      ) {
        scoreData = {
          ...tempScoreData,
          paiPatterns: collectionAndScore.collection.paiPairs.reduce<
            PaiFormat[]
          >((paiList, paiPair) => {
            paiList.push({
              ...paiPair,
              pattern: paiPair.pattern.map<PaiInfo>((paiName) => {
                const [number, group, option] =
                  PaiPatternExtractor.extractPaiPair(paiName);
                return {
                  ...option,
                  number: parseInt(number),
                  isAkaDora: paiName === paiPair.akaDora,
                  pai: `${number}${group}` as PaiName,
                  name: I18n.ja.pai[`${number}${group}` as PaiName].name,
                  group: I18n.ja.pai[`${number}${group}` as PaiName].groupName,
                };
              }),
            });

            return paiList;
          }, []),
        };
      }
    }

    if (!scoreData) {
      return null;
    }

    return Object.assign<ScoreData, typeof scoreData>(
      {
        score: { base: 0 },
        paiPatterns: [],
        yakuType: "NORMAL",
        fu: 0,
        yaku: 0,
        honba: 0,

        appliedFuList: [],
        appliedYakuList: [],
      },
      scoreData,
    );
  }
}
