import { MahjongOption, PaiName, Yaku } from "../@types/types";
import { PaiPairCollection } from "../Collection/Collection";
import { PaiGenerator } from "../Utilities/PaiGenerator";
import { Chinitsu } from "./Chinitsu";
import { convertToNormalPai } from "../Utilities/Converter";

export class Honitsu implements Yaku {
  private paiPairCollection: PaiPairCollection;
  private option: MahjongOption;

  constructor(paiPairCollection: PaiPairCollection, option: MahjongOption) {
    this.paiPairCollection = paiPairCollection;
    this.option = option;
  }

  get type(): Yaku["type"] {
    return "NORMAL";
  }

  get han(): number {
    return this.paiPairCollection.hasFuro ? 2 : 3;
  }

  get parent(): Yaku {
    return new Chinitsu(this.paiPairCollection, this.option);
  }

  get isFulfilled(): boolean {
    const { m, p, s } = PaiGenerator.generateOneToNine();
    const jiHai = PaiGenerator.generateJiHai();

    for (const pai of [m, p, s]) {
      const result: boolean[] = [];
      for (const paiPair of this.paiPairCollection.paiPairs) {
        const hasSameColored = paiPair.pattern.every((paiName) =>
          [...pai, ...jiHai].includes(convertToNormalPai(paiName) as PaiName),
        );

        result.push(hasSameColored);
      }

      if (result.every((v) => v)) {
        return true;
      }
    }

    return false;
  }
}
