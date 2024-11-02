import { PaiName, PaiNamePattern, PaiPair, Shuntsu } from "../@types/types";
import { PaiPatternExtractor } from "../Runtime/Extractor/Extractor";
import { PaiGenerator } from "../Utilities/PaiGenerator";
import { PaiListFormatAreInvalidError } from "../Error/PaiListFormatAreInvalidError";
import { JantouNotFoundError } from "../Error/JantouNotFoundError";

type CountOption = Omit<Required<Record<keyof PaiPair, boolean>>, 'pattern'>

export class PaiPairCollection {
  readonly paiPairs: PaiPair[] = []
  constructor(paiPairs: PaiPair[]) {
    this.paiPairs = paiPairs
  }

  containsKoutsuOrKan(paiName: PaiName): boolean {
    return this.paiPairs.some(paiPair => (paiPair.isKoutsu || paiPair.isKan) && paiPair.pattern.includes(paiName))
  }

  containsJantou(paiName: PaiName): boolean {
    if (!PaiPatternExtractor.shouldToitsu(this.jantou.pattern)) {
      return false
    }
    return this.jantou.pattern.includes(paiName)
  }

  containsShuntsu(paiNames: Shuntsu): boolean {
    return this.paiPairs
      .some(paiPair =>  paiPair.isShuntsu && paiPair.pattern.includesWithMatrix(paiNames, 'AND'))
  }

  get isChiiToitsu(): boolean {
    return this.paiPairs.every(paiPair => paiPair.isToitsu)
  }

  get isKokushiMusou(): boolean {
    return this.paiPairs.some(paiPair => paiPair.isKokushi)
  }

  get isChurenPoutou(): boolean {
    return this.paiPairs.some(paiPair => paiPair.isChuren)
  }

  flat(): PaiName[] {
    return this.paiPairs.reduce<PaiName[]>((carry, paiPair) => [...carry, ...paiPair.pattern], [])
  }

  get hasJantou(): boolean {
    return this.count('isJantou') > 0
  }

  get hasFuro(): boolean {
    return this.count('isFuro') > 0
  }

  get hasToitsu(): boolean {
    return this.count('isToitsu') > 0
  }

  get hasKan(): boolean {
    return this.count('isKan') > 0
  }

  get hasShuntsu(): boolean {
    return this.count('isShuntsu') > 0
  }

  get hasKoutsu(): boolean {
    return this.count('isKoutsu') > 0
  }

  get countJantou(): number {
    return this.count('isJantou')
  }

  get countAkaDora(): number {
    return this.count('includeAkaDora')
  }

  get countFuro(): number {
    return this.count('isFuro')
  }

  get countToitsu(): number {
    return this.count('isToitsu')
  }

  get countKan(): number {
    return this.count('isKan')
  }

  get countShuntsu(): number {
    return this.count('isShuntsu')
  }

  get countKoutsu(): number {
    return this.count('isKoutsu')
  }

  countYaoChuHai(option: Partial<CountOption> = {}): number {
    return this.countPai(
      PaiGenerator.generateYaoChuHai(),
      option,
    )
  }

  countChunChanPai(option: Partial<CountOption> = {}): number {
    return this.countPai(
      PaiGenerator.generateChunChanPai(),
      option,
    )
  }

  countPai(targetPaiList: PaiName[], option: Partial<CountOption> = {}): number {
    if (option.isKan !== undefined && option.isFuro !== undefined) {
      return this.paiPairs.reduce(
        (sum, paiPair) => sum + (
          paiPair.isKan && ((option.isFuro && paiPair.isFuro) || (!option.isFuro && !paiPair.isFuro)) && paiPair.pattern.includesWithMatrix(
            targetPaiList,
          ) ? 1 : 0),
        0,
      )
    }
    if (option.isKoutsu !== undefined && option.isFuro !== undefined) {
      return this.paiPairs.reduce(
        (sum, paiPair) => sum + (
          paiPair.isKoutsu && ((option.isFuro && paiPair.isFuro) || (!option.isFuro && !paiPair.isFuro)) && paiPair.pattern.includesWithMatrix(
            targetPaiList,
          ) ? 1 : 0),
        0,
      )
    }

    if (option.isKan !== undefined) {
      return this.paiPairs.reduce(
        (sum, paiPair) => sum + (
          paiPair.isKan && paiPair.pattern.includesWithMatrix(
            targetPaiList,
          ) ? 1 : 0),
        0,
      )
    }

    if (option.isKoutsu !== undefined) {
      return this.paiPairs.reduce(
        (sum, paiPair) => sum + (
          paiPair.isKoutsu && paiPair.pattern.includesWithMatrix(
            targetPaiList,
          ) ? 1 : 0),
        0,
      )
    }

    if (option.isFuro !== undefined) {
      return this.paiPairs.reduce(
        (sum, paiPair) => sum + (
          ((option.isFuro && paiPair.isFuro) || (!option.isFuro && !paiPair.isFuro)) && paiPair.pattern.includesWithMatrix(
            targetPaiList,
          ) ? 1 : 0),
        0,
      )
    }

    return this.paiPairs.reduce(
      (sum, paiPair) => sum + (
        paiPair.pattern.includesWithMatrix(
          targetPaiList,
        ) ? 1 : 0),
      0,
    )
  }

  count(by: keyof PaiPair): number {
    if (by === 'pattern') {
      throw Error('Specified parameter is not allowed');
    }
    let counter = 0;
    for (const paiPair of this.paiPairs) {
      if (paiPair[by]) {
        counter++
      }
    }

    return counter;
  }

  get jantou(): PaiPair {
    const jantou = this.paiPairs.find((paiPair) => paiPair.isJantou)

    if (!jantou) {
      throw new JantouNotFoundError('A Jantou is not found')
    }
    return jantou
  }

}

export class PaiCollection {
  readonly paiList: PaiName[] = []
  private paiPairList: PaiPair[] = []
  length: number = 0

  private paiNumberName = { "1": "一", "2": "二", "3": "三", "4": "四", "5": "五", "6": "六", "7": "七", "8": "八", "9": "九" }
  private paiGroupNamePatterns: PaiNamePattern = {
    "m": {name: "萬子"},
    "p": {name: "筒子"},
    "s": {name: "索子"},
    "z": {name: "字牌・三元牌", patterns: { "1z": "東", "2z": "南", "3z": "西", "4z": "北", "5z": "白", "6z": "発", "7z": "中" }},
  }

  constructor(paiList: PaiName[]) {
    this.paiList = paiList
    this.validatePaiList()

    this.length = this.paiList.length
  }

  isAvailablePai(name: string): name is PaiName {
    const [extractedName, extractedGroup] = PaiPatternExtractor.extractPaiPair(name as PaiName);
    return (
      ["1", "2", "3", "4", "5", "6", "7"].includes(extractedName) && ["z"].includes(extractedGroup)
    ) || (["1", "2", "3", "4", "5", "6", "7", "8", "9"].includes(extractedName) && ["m", "p", "s"].includes(extractedGroup));
  }

  lookUpPredictionJantouList(): PaiPair[] {
    const jantouList: PaiPair[] = []
    // The max pai is 14 (Basically) + 4 (from wanpai maximally) = 18
    for (let i = 0; i < (14 + 4); i++) {
      const paiList = this.paiList.slice(i, i + 2);
      if (paiList.length !== 2) {
        continue;
      }
      if (paiList[0] !== paiList[1]) {
        continue;
      }
      jantouList.push({
        isKokushi: false,
        isChuren: false,
        isJantou: true,
        isToitsu: true,
        isShuntsu: false,
        isKoutsu: false,
        isKan: false,
        isFuro: false,
        includeAkaDora: false,
        pattern: [paiList[0], paiList[1]],
      })
    }
    return jantouList
  }

  extract(): PaiPairCollection[] {
    const predictionJantouList = this.lookUpPredictionJantouList();
    let paiPairs: PaiPairCollection[] = [];

    if (predictionJantouList.length === 0) {
      // NOTE: The kokushi musou is in specially
      const tryExtraction = (new PaiPatternExtractor(
        new PaiCollection(this.paiList)
      )).extract()

      const findKokushiMusou = tryExtraction
        .find(paiPairs => paiPairs.some(paiPair => paiPair.isKokushi))

      if (findKokushiMusou) {
        return [
          new PaiPairCollection(findKokushiMusou),
        ]
      }

      const findChurenPoutou = tryExtraction
        .find(paiPairs => paiPairs.some(paiPair => paiPair.isChuren))

      if (findChurenPoutou) {
        return [
          new PaiPairCollection(findChurenPoutou),
        ]
      }

      return [
        new PaiPairCollection(this.paiPairList),
      ];
    }
    for (const jantou of predictionJantouList) {
      const extractor = new PaiPatternExtractor(
        new PaiCollection(
          this.diff(jantou),
        )
      );

      for (const extractedPatterns of extractor.extract()) {
        paiPairs.push(new PaiPairCollection([...extractedPatterns, jantou]))
      }
    }

    return paiPairs;
  }

  private diff(removePaiList: PaiPair): PaiName[] {
    const targetRemovePaiList: PaiName[] = [...removePaiList.pattern];
    const newPaiName: PaiName[] = [];
    for (let i = 0, j = 0; i < targetRemovePaiList.length; i++) {
      for (; j < this.paiList.length; j++) {
        if (targetRemovePaiList[i] === this.paiList[j]) {
          continue;
        }
        newPaiName.push(this.paiList[j]);
      }
    }
    return newPaiName
  }

  private validatePaiList() {
    for (let i = 0; i < this.paiList.length; i++) {
      if (!this.isAvailablePai(this.paiList[i])) {
        throw new PaiListFormatAreInvalidError(`The pai format is invalid: ${this.paiList[i]} (index#${i})`)
      }
    }
  }
}

export default {}
