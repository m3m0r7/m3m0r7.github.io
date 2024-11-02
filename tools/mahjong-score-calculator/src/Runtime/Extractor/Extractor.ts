import {
  Kan,
  Koutsu,
  PaiAttr,
  PaiGroup,
  PaiGroupName,
  PaiName,
  PaiNumberName,
  PaiPair,
  Shuntsu,
  Toitsu
} from "../../@types/types";
import { PaiCollection } from "../../Collection/Collection";
import { PaiGenerator } from "../../Utilities/PaiGenerator";

export class PaiPatternExtractor {
  private paiCollection: PaiCollection

  constructor(paiCollection: PaiCollection) {
    this.paiCollection = paiCollection
  }

  static createPaiPair(pattern: PaiName[], option: Partial<PaiPair> = {}): PaiPair {
    const convertedNormallyPattern = pattern.map((paiName) => {
      const [ name, group ] = PaiPatternExtractor.extractPaiPair(paiName)
      return `${name}${group}`
    })

    return {
      isKokushi: false,
      isChuren: false,
      isJantou: false,
      isToitsu: false,
      isShuntsu: false,
      isKoutsu: false,
      isKan: false,
      isFuro: pattern.some((paiName) => {
        const [ _name, _group, attr ] = PaiPatternExtractor.extractPaiPair(paiName)
        return attr.fromFuro
      }),
      includeAkaDora: pattern.some((paiName) => {
        const [ _name, _group, attr ] = PaiPatternExtractor.extractPaiPair(paiName)
        return attr.isAkaDora
      }),
      ...option,
      pattern: convertedNormallyPattern,
    } as PaiPair
  }

  static splitByGroup(paiList: PaiName[]): PaiGroup {
    return paiList.reduce<PaiGroup>((carry, item) => {
      const [ number, group ] = PaiPatternExtractor.extractPaiPair(item);
      return {
        m: [...carry.m, ...(group === 'm' ? [item] : [])],
        p: [...carry.p, ...(group === 'p' ? [item] : [])],
        s: [...carry.s, ...(group === 's' ? [item] : [])],
        z: [...carry.z, ...(group === 'z' ? [item] : [])],
      };
    }, { m: [], p: [], s: [], z: [] })
  }

  static sortByPaiName(paiList: PaiName[], shuntsuFriendly: boolean): PaiName[] {
    const result = paiList.sort((a, b) => {
      const [ aNumber, aGroup ] = PaiPatternExtractor.extractPaiPair(a);
      const [ bNumber, bGroup ] = PaiPatternExtractor.extractPaiPair(b);
      const order = {'m': 0, 'p': 10, 's': 20, 'z': 30};

      return (order[aGroup] + Number(aNumber)) - (order[bGroup] + Number(bNumber))
    })

    if (!shuntsuFriendly) {
      return result
    }

    // Split by groups
    const newResult: PaiGroup<PaiName | null> = PaiPatternExtractor.splitByGroup(result)

    Object.keys(newResult).forEach(keyName => {
      const groupName = keyName as PaiGroupName

      // NOTE: You should to decide length before process a loop because it will change orders based an array
      let len = 0

      // NOTE: Here is definition a start pos
      let i = 0;

      do {
        len = newResult[groupName].length

        const appeared: PaiName[] = [];
        for (; i < len; i++) {
          const paiName = newResult[groupName][i]
          if (paiName === null) {
            continue
          }
          if (appeared.includes(paiName)) {
            newResult[groupName].push(newResult[groupName][i])
            newResult[groupName][i] = null
            continue;
          }
          appeared.push(paiName)
        }
      } while (len !== newResult[groupName].length)
    })

    return [...newResult.m, ...newResult.p, ...newResult.s, ...newResult.z]
      .filter((v): v is PaiName => v != null);
  }

  extractShuntsu(paiList: PaiName[]): [PaiPair[], number[]] {
    const extractedPattern: PaiPair[] = []
    const remainingPaiList: PaiName[] = PaiPatternExtractor.sortByPaiName(paiList, true);
    const solvedPositions: number[] = []

    for (let i = 0; i < remainingPaiList.length; i++) {
      const pattern = remainingPaiList.slice(i, i + 3);

      if (PaiPatternExtractor.shouldShuntsu(pattern)) {

        extractedPattern.push(
          PaiPatternExtractor.createPaiPair(
            pattern,
            { isShuntsu: true },
          )
        )

        solvedPositions.push(i, i + 1, i + 2)
        i += 2
      }
    }

    return [extractedPattern, solvedPositions]
  }

  extractKoutsu(paiList: PaiName[]): [PaiPair[], number[]] {
    const extractedPattern: PaiPair[] = []
    const remainingPaiList: PaiName[] = PaiPatternExtractor.sortByPaiName(paiList, false);
    const solvedPositions: number[] = []

    for (let i = 0; i < remainingPaiList.length; i++) {
      const pattern = remainingPaiList.slice(i, i + 3);

      if (PaiPatternExtractor.shouldKan(remainingPaiList.slice(i, i + 4))) {
        extractedPattern.push(
          PaiPatternExtractor.createPaiPair(
            [remainingPaiList[i], remainingPaiList[i + 1], remainingPaiList[i + 2], remainingPaiList[i + 3]],
            { isKan: true }
          )
        )

        solvedPositions.push(i, i + 1, i + 2, i + 3)
        i += 3
      } else if (PaiPatternExtractor.shouldKoutsu(pattern)) {
        extractedPattern.push(
          PaiPatternExtractor.createPaiPair(
            pattern,
            { isKoutsu: true }
          )
        )
        solvedPositions.push(i, i + 1, i + 2)

        i += 2
      }
    }

    return [extractedPattern, solvedPositions]
  }

  extractUnknown(paiList: PaiName[]): [PaiPair[], number[]] {
    const extractedPattern: PaiPair[] = []
    const remainingPaiList: PaiName[] = PaiPatternExtractor.sortByPaiName(paiList, false);
    const solvedPositions: number[] = []

    for (let i = 0; i < remainingPaiList.length; i++) {
      extractedPattern.push(
        PaiPatternExtractor.createPaiPair(
          [remainingPaiList[i]],
        )
      )

      solvedPositions.push(i)
    }

    return [extractedPattern, solvedPositions]
  }

  extractChiiToitsu(paiList: PaiName[]): [PaiPair[], number[]] {
    const extractedPattern: PaiPair[] = []
    const remainingPaiList: PaiName[] = PaiPatternExtractor.sortByPaiName(paiList, false);
    const solvedPositions: number[] = []

    for (let i = 0; i < remainingPaiList.length; i++) {
      const pattern = remainingPaiList.slice(i, i + 2);

      if (PaiPatternExtractor.shouldToitsu(pattern)) {
        extractedPattern.push(
          PaiPatternExtractor.createPaiPair(
            pattern,
            { isToitsu: true }
          )
        )
        solvedPositions.push(i, i + 1)

        i += 1
      }
    }

    return [extractedPattern, solvedPositions]
  }

  extractKokushiMusou(paiList: PaiName[]): [PaiPair[], number[]] {
    const extractedPattern: PaiPair[] = []
    const remainingPaiList: PaiName[] = PaiPatternExtractor.sortByPaiName(paiList, false);
    const solvedPositions: number[] = []

    if (paiList.length !== 14) {
      return [[], []]
    }

    if (paiList.reduce((carry, item) => carry.filter(pai => pai !== item), PaiGenerator.generateKokushiMusou13MenMachi()).length === 0) {
      return [
        [{
          isKokushi: true,
          isChuren: false,
          isJantou: false,
          isToitsu: false,
          isShuntsu: false,
          isKoutsu: false,
          isKan: false,
          isFuro: false,
          includeAkaDora: false,
          pattern: paiList,
        }],
        Array.from({ length: paiList.length }, (_, k) => k),
      ]
    }

    return [[], []]
  }


  extractChurenPoutou(paiList: PaiName[]): [PaiPair[], number[]] {
    const extractedPattern: PaiPair[] = []
    const remainingPaiList: PaiName[] = PaiPatternExtractor.sortByPaiName(paiList, false);
    const solvedPositions: number[] = []

    if (paiList.length !== 14) {
      return [[], []]
    }

    if (paiList.reduce((carry, item) => carry.filter(pai => pai !== item), PaiGenerator.generateChurenPoutou9MenMachi('m')).length === 0
      || paiList.reduce((carry, item) => carry.filter(pai => pai !== item), PaiGenerator.generateChurenPoutou9MenMachi('p')).length === 0
      || paiList.reduce((carry, item) => carry.filter(pai => pai !== item), PaiGenerator.generateChurenPoutou9MenMachi('s')).length === 0) {
      return [
        [{
          isKokushi: false,
          isChuren: true,
          isJantou: false,
          isToitsu: false,
          isShuntsu: false,
          isKoutsu: false,
          isKan: false,
          isFuro: false,
          includeAkaDora: false,
          pattern: paiList,
        }],
        Array.from({ length: paiList.length }, (_, k) => k),
      ]
    }

    return [[], []]
  }

  extract(): PaiPair[][] {
    const paiPairList: PaiPair[][] = []
    const reducer = <T = unknown>(items: T[], targetNumbers: number[]): T[] => Array.from({ length: items.length }, (_, k) => k)
      .reduce<T[]>((carry, number) => ([...carry, ...(targetNumbers.includes(number) ? [] : [items[number]])]), [])

    // NOTE: Shuntsu friendly
    const [shuntsuFriendlyShuntsuPatterns, shuntsuFriendlyShuntsuSolvedPositions] = this.extractShuntsu(this.paiCollection.paiList)
    const [shuntsuFriendlyKoutsuPatterns, shuntsuFriendlyKoutsuSolvedPositions] = this.extractKoutsu(reducer<PaiName>(this.paiCollection.paiList, shuntsuFriendlyShuntsuSolvedPositions))
    const [shuntsuFriendlyUnknownPaiList] = this.extractUnknown(reducer<PaiName>(this.paiCollection.paiList, [...shuntsuFriendlyShuntsuSolvedPositions, ...shuntsuFriendlyKoutsuSolvedPositions]))
    paiPairList.push([...shuntsuFriendlyShuntsuPatterns, ...shuntsuFriendlyKoutsuPatterns, ...shuntsuFriendlyUnknownPaiList]);

    // NOTE: Non shuntsu friendly
    const [koutsuPatterns, koutsuSolvedPositions] = this.extractKoutsu(this.paiCollection.paiList)
    const [shuntsuPatterns, shuntsuSolvedPositions] = this.extractShuntsu(reducer<PaiName>(this.paiCollection.paiList, koutsuSolvedPositions))
    const [unknownPaiList] = this.extractUnknown(reducer<PaiName>(this.paiCollection.paiList, [...shuntsuSolvedPositions, ...koutsuSolvedPositions]))
    paiPairList.push([...shuntsuPatterns, ...koutsuPatterns, ...unknownPaiList]);

    // NOTE: chiitoitsu
    const [chiitoitsuPatterns, chiitoitsuSolvedPositions] = this.extractChiiToitsu(this.paiCollection.paiList)
    const [chiitoitsuUnknownPaiList] = this.extractUnknown(reducer<PaiName>(this.paiCollection.paiList, chiitoitsuSolvedPositions))
    paiPairList.push([...chiitoitsuPatterns, ...chiitoitsuUnknownPaiList]);

    // NOTE: kokushimusou
    const [kokushimusouPatterns, kokushimusouSolvedPositions] = this.extractKokushiMusou(this.paiCollection.paiList)
    const [kokushimusouUnknownPaiList] = this.extractUnknown(reducer<PaiName>(this.paiCollection.paiList, kokushimusouSolvedPositions))
    paiPairList.push([...kokushimusouPatterns, ...kokushimusouUnknownPaiList]);

    // NOTE: churen poutou
    const [churenPoutouPatterns, churenPoutouSolvedPositions] = this.extractChurenPoutou(this.paiCollection.paiList)
    const [churenPoutouUnknownPaiList] = this.extractUnknown(reducer<PaiName>(this.paiCollection.paiList, churenPoutouSolvedPositions))
    paiPairList.push([...churenPoutouPatterns, ...churenPoutouUnknownPaiList]);

    return paiPairList
  }

  static shouldShuntsu(pattern: PaiName[]): pattern is Shuntsu {
    if (pattern.length !== 3) {
      return false
    }

    const [ aName, aGroup ] = PaiPatternExtractor.extractPaiPair(pattern[0]);
    const [ bName, bGroup ] = PaiPatternExtractor.extractPaiPair(pattern[1]);
    const [ cName, cGroup ] = PaiPatternExtractor.extractPaiPair(pattern[2]);

    if (aGroup === 'z' || bGroup === 'z' || cGroup === 'z') {
      return false
    }

    return parseInt(aName) === (parseInt(bName) - 1) && parseInt(bName) === (parseInt(cName) - 1) && aGroup === bGroup && bGroup === cGroup
  }

  static shouldKan(pattern: PaiName[]): pattern is Kan {
    if (pattern.length !== 4) {
      return false
    }

    const [ aName, aGroup ] = PaiPatternExtractor.extractPaiPair(pattern[0])
    const [ bName, bGroup ] = PaiPatternExtractor.extractPaiPair(pattern[1])
    const [ cName, cGroup ] = PaiPatternExtractor.extractPaiPair(pattern[2])
    const [ dName, dGroup ] = PaiPatternExtractor.extractPaiPair(pattern[3])

    return `${aName}${aGroup}` === `${bName}${bGroup}` && `${bName}${bGroup}` === `${cName}${cGroup}` && `${cName}${cGroup}` === `${dName}${dGroup}`
  }

  static shouldKoutsu(pattern: PaiName[]): pattern is Koutsu {
    if (pattern.length !== 3) {
      return false
    }

    const [ aName, aGroup ] = PaiPatternExtractor.extractPaiPair(pattern[0])
    const [ bName, bGroup ] = PaiPatternExtractor.extractPaiPair(pattern[1])
    const [ cName, cGroup ] = PaiPatternExtractor.extractPaiPair(pattern[2])

    return `${aName}${aGroup}` === `${bName}${bGroup}` && `${bName}${bGroup}` === `${cName}${cGroup}`
  }

  static shouldToitsu(pattern: PaiName[]): pattern is Toitsu {
    if (pattern.length !== 2) {
      return false
    }

    const [ aName, aGroup ] = PaiPatternExtractor.extractPaiPair(pattern[0])
    const [ bName, bGroup ] = PaiPatternExtractor.extractPaiPair(pattern[1])
    return `${aName}${aGroup}` === `${bName}${bGroup}`
  }

  static extractPaiPair(paiName: PaiName): [keyof PaiNumberName, PaiGroupName, { isAkaDora: boolean, fromFuro: boolean }] {
    const paiAttr = paiName.substring(2) as PaiAttr
    return [
      paiName.substring(0, 1) as keyof PaiNumberName,
      paiName.substring(1, 2) as PaiGroupName,
      {
        isAkaDora: paiAttr.includes('a'),
        fromFuro: paiAttr.includes('f'),
      },
    ]
  }
}

export default {}
