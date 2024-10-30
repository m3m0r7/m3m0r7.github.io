import { Yaku } from "../types";
import { PaiPairCollection } from "../Collection";

export class Pinfu implements Yaku {
  private paiPairCollection: PaiPairCollection

  constructor(paiPairCollection: PaiPairCollection) {
    this.paiPairCollection = paiPairCollection
  }

  get han(): number {
    return 1
  }

  get parent(): Yaku | null {
    return null
  }

  // TODO: Not implemented yet
  get isFulfilled(): boolean {
    return false
  }
}
