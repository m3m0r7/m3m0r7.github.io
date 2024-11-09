import { ScoreData, ScoreTable } from "../../@types/types";
import { PaiPairCollection } from "../../Collection/Collection";
import { Mahjong } from "../Mahjong";
import { MahjongFourPlayerStyleScoreCalculator } from "./MahjongFourPlayerStyleScoreCalculator";
import { MahjongThreePlayerStyleScoreCalculator } from "./MahjongThreePlayerStyleScoreCalculator";
import { CannotCalculateScoreError } from "../../Error/CannotCalculateScoreError";

export const scoreTable: { parent: ScoreTable; child: ScoreTable } = {
  parent: {
    1: {
      30: 1500,
      40: 2000,
      50: 2400,
      60: 2900,
      70: 3400,
      80: 3900,
      90: 4400,
      100: 4800,
      110: 5300,
    },
    2: {
      25: 2400,
      30: 2900,
      40: 3900,
      50: 4800,
      60: 5800,
      70: 6800,
      80: 7700,
      90: 8700,
      100: 9600,
      110: 10600,
    },
    3: {
      25: 4800,
      30: 5800,
      40: 7700,
      50: 9600,
      60: 11600,
      70: 12000,
      80: 12000,
      90: 12000,
      100: 12000,
      110: 12000,
    },
    4: {
      25: 9600,
      30: 11600,
      40: 12000,
      50: 12000,
      60: 12000,
      70: 12000,
      80: 12000,
      90: 12000,
      100: 12000,
      110: 12000,
    },
  },
  child: {
    1: {
      30: 1000,
      40: 1300,
      50: 1600,
      60: 2000,
      70: 2300,
      80: 2600,
      90: 2900,
      100: 3200,
      110: 3600,
    },
    2: {
      25: 1600,
      30: 2000,
      40: 2600,
      50: 3200,
      60: 3900,
      70: 4500,
      80: 5200,
      90: 5800,
      100: 6400,
      110: 7100,
    },
    3: {
      25: 3200,
      30: 3900,
      40: 5200,
      50: 6400,
      60: 7700,
      70: 8000,
      80: 8000,
      90: 8000,
      100: 8000,
      110: 8000,
    },
    4: {
      25: 6400,
      30: 7700,
      40: 8000,
      50: 8000,
      60: 8000,
      70: 8000,
      80: 8000,
      90: 8000,
      100: 8000,
      110: 8000,
    },
  },
};

export const roundUpScore = (score: number): number =>
  Math.ceil(score / 100) * 100;

export const calculateScore = (
  fu: ScoreData["fu"],
  yaku: ScoreData["yaku"],
  isParent: boolean,
): [ScoreData["yakuType"], number] => {
  let baseScore = 0;
  let yakuType: ScoreData["yakuType"] = "NORMAL";
  if (yaku === "DOUBLE_FULL") {
    // NOTE: Double Yakuman
    baseScore += isParent ? 96000 : 64000;
    yakuType = "DOUBLE_YAKUMAN";
  } else if (yaku === "FULL") {
    // NOTE: Yakuman
    baseScore += isParent ? 48000 : 32000;
    yakuType = "YAKUMAN";
  } else if (yaku >= 11 && yaku <= 12) {
    // NOTE: Normally scoring
    baseScore += isParent ? 36000 : 24000;
    yakuType = "SANBAIMAN";
  } else if (yaku >= 8 && yaku <= 10) {
    // NOTE: Normally scoring
    baseScore += isParent ? 24000 : 16000;
    yakuType = "BAIMAN";
  } else if (yaku >= 6 && yaku <= 7) {
    // NOTE: Normally scoring
    baseScore += isParent ? 18000 : 12000;
    yakuType = "HANEMAN";
  } else if (yaku >= 5) {
    baseScore += isParent ? 12000 : 8000;
    yakuType = "MANGAN";
  } else {
    // NOTE: under 4 yaku
    const scoreByScoreTable =
      scoreTable?.[isParent ? "parent" : "child"]?.[yaku]?.[fu ?? 30] ?? 0;
    baseScore += scoreByScoreTable;

    if (
      (!isParent && scoreByScoreTable === 8000) ||
      (isParent && scoreByScoreTable === 12000)
    ) {
      yakuType = "MANGAN";
    }
  }

  return [yakuType, baseScore];
};

export class MahjongScore {
  private paiPairCollections: PaiPairCollection[];
  private mahjong: Mahjong;

  constructor(mahjong: Mahjong, paiPairCollections: PaiPairCollection[]) {
    this.mahjong = mahjong;
    this.paiPairCollections = paiPairCollections;
  }

  get value() {
    return this.calculator.score;
  }

  get calculator() {
    const scoreCalculator =
      this.mahjong.option.playStyle === 3
        ? new MahjongThreePlayerStyleScoreCalculator(
            this.mahjong,
            this.paiPairCollections,
          )
        : new MahjongFourPlayerStyleScoreCalculator(
            this.mahjong,
            this.paiPairCollections,
          );

    if (!scoreCalculator.isValid) {
      throw new CannotCalculateScoreError(
        "The mahjong scores are not available that reason for Yaku are not fulfilled, invalid format and so on",
      );
    }

    return scoreCalculator;
  }
}
