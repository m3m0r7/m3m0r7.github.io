import { MahjongOption, Yaku } from "../@types/types";
import { PaiPairCollection } from "../Collection/Collection";

export class RyuIsou implements Yaku {
  private paiPairCollection: PaiPairCollection;
  private option: MahjongOption;

  constructor(paiPairCollection: PaiPairCollection, option: MahjongOption) {
    this.paiPairCollection = paiPairCollection;
    this.option = option;
  }

  get type(): Yaku["type"] {
    return "FULL";
  }

  get isFulfilled(): boolean {
    const ryanzou = this.paiPairCollection.containsKoutsuOrKan("2s");
    const susou = this.paiPairCollection.containsKoutsuOrKan("4s");
    const rousou = this.paiPairCollection.containsKoutsuOrKan("6s");
    const pasou = this.paiPairCollection.containsKoutsuOrKan("8s");
    const hatsu = this.paiPairCollection.containsKoutsuOrKan("6z");

    const jantouRyanzou = this.paiPairCollection.containsJantou("2s");
    const jantouSusou = this.paiPairCollection.containsJantou("4s");
    const jantouRousou = this.paiPairCollection.containsJantou("6s");
    const jantouPasou = this.paiPairCollection.containsJantou("8s");
    const jantouHatsu = this.paiPairCollection.containsJantou("6z");

    return (
      (ryanzou && susou && rousou && pasou && jantouHatsu) ||
      (susou && rousou && pasou && hatsu && jantouRyanzou) ||
      (rousou && pasou && hatsu && ryanzou && jantouSusou) ||
      (pasou && hatsu && ryanzou && susou && jantouRousou) ||
      (hatsu && ryanzou && susou && rousou && jantouPasou)
    );
  }
}
