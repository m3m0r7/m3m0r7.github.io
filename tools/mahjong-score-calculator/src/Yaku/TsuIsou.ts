import { MahjongOption, Yaku } from "../@types/types";
import { PaiPairCollection } from "../Collection/Collection";
import { PaiGenerator } from "../Utilities/PaiGenerator";
import { Chinitsu } from "./Chinitsu";

export class TsuIsou implements Yaku {
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
    return this.paiPairCollection.paiPairs
      // NOTE: The TsuIsou yaku is needed that koutsu and/or jantou are fulfilled by jihai or kazehai
      .every(paiPair => (paiPair.isJantou || paiPair.isKoutsu || paiPair.isKan) && paiPair.pattern.includesWithMatrix([...PaiGenerator.generateJiHai(), ...PaiGenerator.generateKazeHai()]))
  }
}
