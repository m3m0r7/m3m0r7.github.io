import { MahjongOption, PaiName, Validator } from "../@types/types";
import { PaiGenerator } from "../Utilities/PaiGenerator";

export class MahjongHaiTypeValidator implements Validator {
  readonly paiList: PaiName[]
  private option: MahjongOption

  constructor(paiList: PaiName[], option: MahjongOption) {
    this.option = option
    this.paiList = paiList
  }

  validate(): boolean {
    const availablePaiList = [
      ...(new PaiGenerator('1', '9', 'm')).generate(),
      ...(new PaiGenerator('1', '9', 'p')).generate(),
      ...(new PaiGenerator('1', '9', 's')).generate(),
      ...(new PaiGenerator('1', '7', 'z')).generate(),
    ].reduce<Record<PaiName, number>>((carry, pai) => ({ ...carry, [pai]: 4 }), {} as Record<PaiName, number>);

    for (let i = 0; i < this.paiList.length; i++) {
      const targetPaiName = this.paiList[i]
      availablePaiList[targetPaiName] = availablePaiList[targetPaiName] - 1
      if (availablePaiList[targetPaiName] < 0) {
        return false
      }
    }

    return true;
  }
}
