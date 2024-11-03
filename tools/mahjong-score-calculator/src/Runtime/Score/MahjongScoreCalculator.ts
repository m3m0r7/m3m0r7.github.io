import { PaiPairCollection } from "../../Collection/Collection";
import { Mahjong } from "../Mahjong";
import { CannotCalculateScoreError } from "../../Error/CannotCalculateScoreError";
import { MahjongFourPlayerStyleScoreCalculator } from "./MahjongFourPlayerStyleScoreCalculator";

export class MahjongScoreCalculator {
  private paiPairCollections: PaiPairCollection[];
  private mahjong: Mahjong;

  constructor(mahjong: Mahjong, paiPairCollections: PaiPairCollection[]) {
    this.mahjong = mahjong;
    this.paiPairCollections = paiPairCollections;
  }

  get fourPlayerStyleScore() {
    const scoreCalculator = new MahjongFourPlayerStyleScoreCalculator(
      this.mahjong,
      this.paiPairCollections,
    );

    if (!scoreCalculator.isValid) {
      throw new CannotCalculateScoreError(
        "The mahjong scores are not available that reason for Yaku are not fulfilled, invalid format and so on",
      );
    }

    return scoreCalculator.score;
  }

  get threePlayerStyleScore() {
    throw Error("Three play style score calculation is not available");
  }
}
