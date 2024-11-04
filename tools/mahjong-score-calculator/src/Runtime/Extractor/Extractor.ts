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
  Toitsu,
} from "../../@types/types";
import { PaiCollection } from "../../Collection/Collection";
import { PaiGenerator } from "../../Utilities/PaiGenerator";

export class PaiPatternExtractor {
  private paiCollection: PaiCollection;

  constructor(paiCollection: PaiCollection) {
    this.paiCollection = paiCollection;
  }

  static createPaiPair(
    pattern: PaiName[],
    option: Partial<PaiPair> = {},
  ): PaiPair {
    const convertedNormallyPattern = pattern.map((paiName) => {
      const [name, group] = PaiPatternExtractor.extractPaiPair(paiName);
      return `${name}${group}`;
    });

    let akaDora = pattern.find((paiName) => {
      const [_name, _group, attr] = PaiPatternExtractor.extractPaiPair(paiName);
      return attr.isAkaDora;
    });

    if (akaDora) {
      const [number, group] = PaiPatternExtractor.extractPaiPair(akaDora);
      akaDora = `${number}${group}` as PaiName;
    }

    return {
      isKokushi: false,
      isChuren: false,
      isJantou: false,
      isToitsu: false,
      isShuntsu: false,
      isKoutsu: false,
      isKan: false,
      isFuro: pattern.some((paiName) => {
        const [_name, _group, attr] =
          PaiPatternExtractor.extractPaiPair(paiName);
        return attr.fromFuro;
      }),
      akaDora,
      ...option,
      pattern: convertedNormallyPattern,
    } as PaiPair;
  }

  static splitByGroup(paiList: PaiName[]): PaiGroup {
    return paiList.reduce<PaiGroup>(
      (carry, item) => {
        const [number, group] = PaiPatternExtractor.extractPaiPair(item);
        return {
          m: [...carry.m, ...(group === "m" ? [item] : [])],
          p: [...carry.p, ...(group === "p" ? [item] : [])],
          s: [...carry.s, ...(group === "s" ? [item] : [])],
          z: [...carry.z, ...(group === "z" ? [item] : [])],
        };
      },
      { m: [], p: [], s: [], z: [] },
    );
  }

  static sortByPaiName(
    paiList: PaiName[],
    shuntsuFriendly: boolean,
  ): PaiName[] {
    const result = paiList.sort((a, b) => {
      const [aNumber, aGroup] = PaiPatternExtractor.extractPaiPair(a);
      const [bNumber, bGroup] = PaiPatternExtractor.extractPaiPair(b);
      const order = { m: 0, p: 10, s: 20, z: 30 };

      return (
        order[aGroup] + Number(aNumber) - (order[bGroup] + Number(bNumber))
      );
    });

    if (!shuntsuFriendly) {
      return result;
    }

    // NOTE: Here is customised an interleaves logic for mahjong.
    //       Mahjong sorting algo., is picking-up and grouping sequence able and remaining pais should regularly sort.
    //       Especially, Ipeikou yaku and RyanPeikou (...and more) yaku needs/requires this algo.,.
    const sortedResult: {
      original: PaiName[];
      sorted: PaiName[];
      pickedPositions: number[];
    } = {
      original: result,
      sorted: [],
      pickedPositions: [],
    };
    const generatedShuntsuPatterns = PaiGenerator.generateShuntsuPatterns();

    for (let i = 0; i < generatedShuntsuPatterns.length; ) {
      const result: number[] = [];
      const shuntsuPattern = generatedShuntsuPatterns[i];
      const shuntsuPatterns = [
        PaiPatternExtractor.extractPaiPair(shuntsuPattern[0]),
        PaiPatternExtractor.extractPaiPair(shuntsuPattern[1]),
        PaiPatternExtractor.extractPaiPair(shuntsuPattern[2]),
      ];

      for (let k = 0; k < shuntsuPatterns.length; k++) {
        const [aNumber, aGroup] = shuntsuPatterns[k];

        for (let i = 0; i < sortedResult.original.length; i++) {
          if (sortedResult.pickedPositions.includes(i)) {
            continue;
          }
          const [bNumber, bGroup] = PaiPatternExtractor.extractPaiPair(
            sortedResult.original[i],
          );
          if (
            !result.includes(i) &&
            `${aNumber}${aGroup}` === `${bNumber}${bGroup}`
          ) {
            result.push(i);
            break;
          }
        }

        if (result.length === 3) {
          break;
        }
      }

      if (result.length === 3) {
        sortedResult.pickedPositions.push(...result);
        sortedResult.sorted.push(
          ...result.map((v) => sortedResult.original[v]),
        );
      }

      if (result.length < 3) {
        i++;
      }
    }

    for (let i = 0; i < sortedResult.original.length; i++) {
      if (sortedResult.pickedPositions.includes(i)) {
        continue;
      }
      sortedResult.sorted.push(sortedResult.original[i]);
      sortedResult.pickedPositions.push(i);
    }

    return sortedResult.sorted;
  }

  extractShuntsu(paiList: PaiName[]): [PaiPair[], number[]] {
    const extractedPattern: PaiPair[] = [];
    const remainingPaiList: PaiName[] = PaiPatternExtractor.sortByPaiName(
      paiList,
      true,
    );
    const solvedPositions: number[] = [];

    for (let i = 0; i < remainingPaiList.length; i++) {
      const pattern = remainingPaiList.slice(i, i + 3);

      if (PaiPatternExtractor.shouldShuntsu(pattern)) {
        extractedPattern.push(
          PaiPatternExtractor.createPaiPair(pattern, { isShuntsu: true }),
        );

        solvedPositions.push(i, i + 1, i + 2);
        i += 2;
      }
    }

    return [extractedPattern, solvedPositions];
  }

  extractKoutsu(
    paiList: PaiName[],
    kanFriendly: boolean = true,
  ): [PaiPair[], number[]] {
    const extractedPattern: PaiPair[] = [];
    const remainingPaiList: PaiName[] = PaiPatternExtractor.sortByPaiName(
      paiList,
      false,
    );
    const solvedPositions: number[] = [];

    for (let i = 0; i < remainingPaiList.length; i++) {
      const pattern = remainingPaiList.slice(i, i + 3);

      if (
        kanFriendly &&
        PaiPatternExtractor.shouldKan(remainingPaiList.slice(i, i + 4))
      ) {
        extractedPattern.push(
          PaiPatternExtractor.createPaiPair(
            [
              remainingPaiList[i],
              remainingPaiList[i + 1],
              remainingPaiList[i + 2],
              remainingPaiList[i + 3],
            ],
            { isKan: true },
          ),
        );

        solvedPositions.push(i, i + 1, i + 2, i + 3);
        i += 3;
      } else if (PaiPatternExtractor.shouldKoutsu(pattern)) {
        extractedPattern.push(
          PaiPatternExtractor.createPaiPair(pattern, { isKoutsu: true }),
        );
        solvedPositions.push(i, i + 1, i + 2);

        i += 2;
      }
    }

    return [extractedPattern, solvedPositions];
  }

  extractUnknown(paiList: PaiName[]): [PaiPair[], number[]] {
    const extractedPattern: PaiPair[] = [];
    const remainingPaiList: PaiName[] = PaiPatternExtractor.sortByPaiName(
      paiList,
      false,
    );
    const solvedPositions: number[] = [];

    for (let i = 0; i < remainingPaiList.length; i++) {
      extractedPattern.push(
        PaiPatternExtractor.createPaiPair([remainingPaiList[i]]),
      );

      solvedPositions.push(i);
    }

    return [extractedPattern, solvedPositions];
  }

  extractChiiToitsu(paiList: PaiName[]): [PaiPair[], number[]] {
    const extractedPattern: PaiPair[] = [];
    const remainingPaiList: PaiName[] = PaiPatternExtractor.sortByPaiName(
      paiList,
      false,
    );
    const solvedPositions: number[] = [];

    for (let i = 0; i < remainingPaiList.length; i++) {
      const pattern = remainingPaiList.slice(i, i + 2);

      if (PaiPatternExtractor.shouldToitsu(pattern)) {
        extractedPattern.push(
          PaiPatternExtractor.createPaiPair(pattern, { isToitsu: true }),
        );
        solvedPositions.push(i, i + 1);

        i += 1;
      }
    }

    return [extractedPattern, solvedPositions];
  }

  extractKokushiMusou(paiList: PaiName[]): [PaiPair[], number[]] {
    const extractedPattern: PaiPair[] = [];
    const remainingPaiList: PaiName[] = PaiPatternExtractor.sortByPaiName(
      paiList,
      false,
    );
    const solvedPositions: number[] = [];

    if (paiList.length !== 14) {
      return [[], []];
    }

    if (
      paiList.reduce(
        (carry, item) => carry.filter((pai) => pai !== item),
        PaiGenerator.generateKokushiMusou13MenMachi(),
      ).length === 0
    ) {
      return [
        [
          {
            isKokushi: true,
            isChuren: false,
            isJantou: false,
            isToitsu: false,
            isShuntsu: false,
            isKoutsu: false,
            isKan: false,
            isFuro: false,
            akaDora: null,
            pattern: paiList,
          },
        ],
        Array.from({ length: paiList.length }, (_, k) => k),
      ];
    }

    return [[], []];
  }

  extractChurenPoutou(paiList: PaiName[]): [PaiPair[], number[]] {
    const extractedPattern: PaiPair[] = [];
    const remainingPaiList: PaiName[] = PaiPatternExtractor.sortByPaiName(
      paiList,
      false,
    );
    const solvedPositions: number[] = [];

    if (paiList.length !== 14) {
      return [[], []];
    }

    for (const groupName of ["m", "p", "s"] as PaiGroupName[]) {
      for (const pai of PaiGenerator.generateChurenPoutou9MenMachi(groupName)) {
        const pattern = PaiPatternExtractor.sortByPaiName(
          [...PaiGenerator.generateChurenPoutou9MenMachi(groupName), pai],
          false,
        );

        if (remainingPaiList.same(pattern)) {
          return [
            [
              {
                isKokushi: false,
                isChuren: true,
                isJantou: false,
                isToitsu: false,
                isShuntsu: false,
                isKoutsu: false,
                isKan: false,
                isFuro: false,
                akaDora: null,
                pattern: remainingPaiList,
              },
            ],
            Array.from({ length: remainingPaiList.length }, (_, k) => k),
          ];
        }
      }
    }

    return [[], []];
  }

  extract(): PaiPair[][] {
    const paiPairList: PaiPair[][] = [];
    const reducer = <T = unknown>(items: T[], targetNumbers: number[]): T[] =>
      Array.from({ length: items.length }, (_, k) => k).reduce<T[]>(
        (carry, number) => [
          ...carry,
          ...(targetNumbers.includes(number) ? [] : [items[number]]),
        ],
        [],
      );

    for (const kanFriendly of [true, false]) {
      // NOTE: Shuntsu friendly
      const [
        shuntsuFriendlyShuntsuPatterns,
        shuntsuFriendlyShuntsuSolvedPositions,
      ] = this.extractShuntsu(this.paiCollection.paiList);
      const [
        shuntsuFriendlyKoutsuPatterns,
        shuntsuFriendlyKoutsuSolvedPositions,
      ] = this.extractKoutsu(
        reducer<PaiName>(
          this.paiCollection.paiList,
          shuntsuFriendlyShuntsuSolvedPositions,
        ),
        kanFriendly,
      );
      const [shuntsuFriendlyUnknownPaiList] = this.extractUnknown(
        reducer<PaiName>(this.paiCollection.paiList, [
          ...shuntsuFriendlyShuntsuSolvedPositions,
          ...shuntsuFriendlyKoutsuSolvedPositions,
        ]),
      );
      paiPairList.push([
        ...shuntsuFriendlyShuntsuPatterns,
        ...shuntsuFriendlyKoutsuPatterns,
        ...shuntsuFriendlyUnknownPaiList,
      ]);

      // NOTE: Non shuntsu friendly
      const [koutsuPatterns, koutsuSolvedPositions] = this.extractKoutsu(
        this.paiCollection.paiList,
        kanFriendly,
      );
      const [shuntsuPatterns, shuntsuSolvedPositions] = this.extractShuntsu(
        reducer<PaiName>(this.paiCollection.paiList, koutsuSolvedPositions),
      );
      const [unknownPaiList] = this.extractUnknown(
        reducer<PaiName>(this.paiCollection.paiList, [
          ...shuntsuSolvedPositions,
          ...koutsuSolvedPositions,
        ]),
      );
      paiPairList.push([
        ...shuntsuPatterns,
        ...koutsuPatterns,
        ...unknownPaiList,
      ]);
    }

    // NOTE: chiitoitsu
    const [chiitoitsuPatterns, chiitoitsuSolvedPositions] =
      this.extractChiiToitsu(this.paiCollection.paiList);
    const [chiitoitsuUnknownPaiList] = this.extractUnknown(
      reducer<PaiName>(this.paiCollection.paiList, chiitoitsuSolvedPositions),
    );
    paiPairList.push([...chiitoitsuPatterns, ...chiitoitsuUnknownPaiList]);

    // NOTE: kokushimusou
    const [kokushimusouPatterns, kokushimusouSolvedPositions] =
      this.extractKokushiMusou(this.paiCollection.paiList);
    const [kokushimusouUnknownPaiList] = this.extractUnknown(
      reducer<PaiName>(this.paiCollection.paiList, kokushimusouSolvedPositions),
    );
    paiPairList.push([...kokushimusouPatterns, ...kokushimusouUnknownPaiList]);

    // NOTE: churen poutou
    const [churenPoutouPatterns, churenPoutouSolvedPositions] =
      this.extractChurenPoutou(this.paiCollection.paiList);
    const [churenPoutouUnknownPaiList] = this.extractUnknown(
      reducer<PaiName>(this.paiCollection.paiList, churenPoutouSolvedPositions),
    );
    paiPairList.push([...churenPoutouPatterns, ...churenPoutouUnknownPaiList]);

    return paiPairList;
  }

  static shouldShuntsu(pattern: PaiName[]): pattern is Shuntsu {
    if (pattern.length !== 3) {
      return false;
    }

    const [aName, aGroup] = PaiPatternExtractor.extractPaiPair(pattern[0]);
    const [bName, bGroup] = PaiPatternExtractor.extractPaiPair(pattern[1]);
    const [cName, cGroup] = PaiPatternExtractor.extractPaiPair(pattern[2]);

    if (aGroup === "z" || bGroup === "z" || cGroup === "z") {
      return false;
    }

    return (
      parseInt(aName) === parseInt(bName) - 1 &&
      parseInt(bName) === parseInt(cName) - 1 &&
      aGroup === bGroup &&
      bGroup === cGroup
    );
  }

  static shouldKan(pattern: PaiName[]): pattern is Kan {
    if (pattern.length !== 4) {
      return false;
    }

    const [aName, aGroup] = PaiPatternExtractor.extractPaiPair(pattern[0]);
    const [bName, bGroup] = PaiPatternExtractor.extractPaiPair(pattern[1]);
    const [cName, cGroup] = PaiPatternExtractor.extractPaiPair(pattern[2]);
    const [dName, dGroup] = PaiPatternExtractor.extractPaiPair(pattern[3]);

    return (
      `${aName}${aGroup}` === `${bName}${bGroup}` &&
      `${bName}${bGroup}` === `${cName}${cGroup}` &&
      `${cName}${cGroup}` === `${dName}${dGroup}`
    );
  }

  static shouldKoutsu(pattern: PaiName[]): pattern is Koutsu {
    if (pattern.length !== 3) {
      return false;
    }

    const [aName, aGroup] = PaiPatternExtractor.extractPaiPair(pattern[0]);
    const [bName, bGroup] = PaiPatternExtractor.extractPaiPair(pattern[1]);
    const [cName, cGroup] = PaiPatternExtractor.extractPaiPair(pattern[2]);

    return (
      `${aName}${aGroup}` === `${bName}${bGroup}` &&
      `${bName}${bGroup}` === `${cName}${cGroup}`
    );
  }

  static shouldToitsu(pattern: PaiName[]): pattern is Toitsu {
    if (pattern.length !== 2) {
      return false;
    }

    const [aName, aGroup] = PaiPatternExtractor.extractPaiPair(pattern[0]);
    const [bName, bGroup] = PaiPatternExtractor.extractPaiPair(pattern[1]);
    return `${aName}${aGroup}` === `${bName}${bGroup}`;
  }

  static extractPaiPair(paiName: PaiName): [
    keyof PaiNumberName,
    PaiGroupName,
    {
      isAkaDora: boolean;
      fromFuro: boolean;
      isUraDora?: boolean;
      isDora?: boolean;
      isHoraPai?: boolean;
    },
  ] {
    const paiAttr = paiName.substring(2) as PaiAttr;
    return [
      paiName.substring(0, 1) as keyof PaiNumberName,
      paiName.substring(1, 2) as PaiGroupName,
      {
        isAkaDora: paiAttr.includes("a"),
        fromFuro: paiAttr.includes("f"),
        ...(paiAttr.includes("u") ? { isUraDora: paiAttr.includes("u") } : {}),
        ...(paiAttr.includes("d") ? { isDora: paiAttr.includes("d") } : {}),
        ...(paiAttr.includes("h") ? { isHoraPai: paiAttr.includes("h") } : {}),
      },
    ];
  }
}

export default {};
