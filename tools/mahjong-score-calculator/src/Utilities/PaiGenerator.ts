import { OneToNine, PaiGroup, PaiGroupName, PaiName, Shuntsu } from "../@types/types";

class PaiGeneratorCache {
  private static paiCache: Record<string, PaiName[]> = {}

  static getOrSet(name: string, payload: () => PaiName[]) {
    if (PaiGeneratorCache.paiCache[name]) {
      return PaiGeneratorCache.paiCache[name]
    }
    return PaiGeneratorCache.paiCache[name] = payload()
  }
}

export class PaiGenerator {
  private from: OneToNine
  private to: OneToNine
  private group: PaiGroupName

  private static paiCache: Record<string, PaiName[] | null>

  constructor(from: OneToNine, to: OneToNine, group: PaiGroupName) {
    this.from = from
    this.to = to
    this.group = group
  }

  generate(): PaiName[] {
    const names: PaiName[] = [];
    for (let i = parseInt(this.from); i <= parseInt(this.to); i++) {
      names.push(`${i}${this.group}` as PaiName)
    }

    return names
  }

  static generateRoutouHai(): PaiName[] {
    return ["1m", "9m", "1p", "9p", "1s", "9s"]
  }

  static generatePenchanHai(): PaiName[][] {
    return PaiGeneratorCache.getOrSet('penchanHai', () => [
      ...(new PaiGenerator('1', '3', 'm')).generate(),
      ...(new PaiGenerator('7', '9', 'm')).generate(),
      ...(new PaiGenerator('1', '3', 'p')).generate(),
      ...(new PaiGenerator('7', '9', 'p')).generate(),
      ...(new PaiGenerator('1', '3', 's')).generate(),
      ...(new PaiGenerator('7', '9', 's')).generate(),
    ]).chunk(3);
  }

  static generateOneToNine(): { m: PaiName[], p: PaiName[], s: PaiName[] } {
    const m = PaiGeneratorCache.getOrSet('oneToNineManzu', () => (new PaiGenerator('1', '9', 'm')).generate())
    const p = PaiGeneratorCache.getOrSet('oneToNinePinzu', () => (new PaiGenerator('1', '9', 'p')).generate())
    const s = PaiGeneratorCache.getOrSet('oneToNineSozu', () => (new PaiGenerator('1', '9', 'm')).generate())
    return {
      m,
      p,
      s,
    };
  }

  static generateChunChanPai(): PaiName[] {
    return PaiGeneratorCache.getOrSet('chunChanPai', () => [
      ...(new PaiGenerator('2', '8', 'm')).generate(),
      ...(new PaiGenerator('2', '8', 'p')).generate(),
      ...(new PaiGenerator('2', '8', 's')).generate(),
    ])
  }

  static generateYaoChuHai(): PaiName[] {
    return PaiGeneratorCache.getOrSet('yaoChuHai', () => [...PaiGenerator.generateRoutouHai(), ...this.generateJiHai()])
  }

  static generateJiHai(): PaiName[] {
    return PaiGeneratorCache.getOrSet('jiHai', () => [...PaiGenerator.generateKazeHai(), ...PaiGenerator.generateSangenPai()])
  }

  static generateKazeHai(): PaiName[] {
    return PaiGeneratorCache.getOrSet('kazeHai', () => (new PaiGenerator('1', '4', 'z')).generate())
  }

  static generateSangenPai(): PaiName[] {
    return PaiGeneratorCache.getOrSet('sangenPai', () => (new PaiGenerator('5', '7', 'z')).generate())
  }

  static generateKokushiMusou13MenMachi(): PaiName[] {
    return PaiGeneratorCache.getOrSet('kokushiMusou13MenMachi', () => [
      ...this.generateRoutouHai(),
      ...this.generateJiHai(),
    ])
  }

  static generateChurenPoutou9MenMachi(groupName: PaiGroupName): PaiName[] {
    return PaiGeneratorCache.getOrSet(`churenPoutou9MenMachi.${groupName}`, () => [
      `1${groupName}`, `1${groupName}`, `1${groupName}`,

      `2${groupName}`, `3${groupName}`, `4${groupName}`,
      `5${groupName}`, `6${groupName}`, `7${groupName}`, `8${groupName}`,

      `9${groupName}`, `9${groupName}`, `9${groupName}`,
    ] as PaiName[])
  }

  static generateShuntsuPatterns(): PaiName[][] {
    let shuntsuPatterns: PaiName[][] = []
    for (const groupName of [ 'm', 'p', 's' ]) {
      for (let i = 1; i <= (9 - 2); i++) {
        shuntsuPatterns.push([`${i}${groupName}`, `${i + 1}${groupName}`, `${i + 2}${groupName}`] as PaiName[])
      }
    }
    return shuntsuPatterns
  }
}
