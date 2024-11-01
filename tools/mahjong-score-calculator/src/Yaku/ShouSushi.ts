import { MahjongOption, PaiName, Yaku } from "../@types/types";
import { PaiPairCollection } from "../Collection/Collection";

export class ShouSushi implements Yaku {
  private paiPairCollection: PaiPairCollection
  private option: MahjongOption

  constructor(paiPairCollection: PaiPairCollection, option: MahjongOption) {
    this.paiPairCollection = paiPairCollection
    this.option = option
  }

  get type(): Yaku['type'] {
    return 'FULL'
  }

  get isFulfilled(): boolean {
    const ton = this.paiPairCollection.containsKoutsuOrKan('1z')
    const nan = this.paiPairCollection.containsKoutsuOrKan('2z')
    const sha = this.paiPairCollection.containsKoutsuOrKan('3z')
    const pe = this.paiPairCollection.containsKoutsuOrKan('4z')

    const jantouTon = this.paiPairCollection.containsJantou('1z')
    const jantouNan = this.paiPairCollection.containsJantou('2z')
    const jantouSha = this.paiPairCollection.containsJantou('3z')
    const jantouPe = this.paiPairCollection.containsJantou('4z')

    return (ton && nan && sha && jantouPe)
      || (nan && sha && pe && jantouTon)
      || (sha && pe && ton && jantouNan)
      || (pe && ton && nan && jantouSha)
  }
}
