import { MahjongOption, PaiName, Validator } from "../@types/types";
import { PaiGenerator } from "../Utilities/PaiGenerator";
import { PaiPatternExtractor } from "../Runtime/Extractor/Extractor";
import { convertToNormalPai } from "../Utilities/Converter";

export class MahjongHaiTypeValidator implements Validator {
  readonly paiList: PaiName[];
  private option: MahjongOption;

  constructor(paiList: PaiName[], option: MahjongOption) {
    this.option = option;
    this.paiList = paiList;
  }

  validate(): boolean {
    const availablePaiList = [
      ...(this.option.playStyle === 3
        ? ["1m", "9m"]
        : new PaiGenerator("1", "9", "m").generate()),
      ...new PaiGenerator("1", "9", "p").generate(),
      ...new PaiGenerator("1", "9", "s").generate(),
      ...new PaiGenerator("1", "7", "z").generate(),
    ].reduce<Record<PaiName, number>>(
      (carry, pai) => ({ ...carry, [pai]: 4 }),
      {} as Record<PaiName, number>,
    );

    for (let i = 0; i < this.paiList.length; i++) {
      const targetPaiName = convertToNormalPai(this.paiList[i], false);
      if (!targetPaiName) {
        return false;
      }
      availablePaiList[targetPaiName] =
        (availablePaiList[targetPaiName] ?? 0) - 1;
      if (availablePaiList[targetPaiName] < 0) {
        return false;
      }
    }

    if (!this.validateKan()) {
      return false;
    }

    return true;
  }

  private validateKan(): boolean {
    return Object.values(
      this.paiList
        .filter((v) => {
          const [_name, _group, option] = PaiPatternExtractor.extractPaiPair(v);
          return option.isKanPai;
        })
        .reduce<Record<string, number>>((carry, pai) => {
          const [name, group, option] = PaiPatternExtractor.extractPaiPair(pai);
          return {
            ...carry,
            [`${name}${group}`]: (carry[`${name}${group}`] ?? 0) + 1,
          };
        }, {}),
    ).every((v) => v === 4);
  }
}
