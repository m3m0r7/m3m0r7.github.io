type Repeat<T, N extends number, R extends T[] = []> =
  R['length'] extends N
    ? R
    : Repeat<T, N, [T, ...R]>;

type GenerateCombinationsFromString<
  T extends string,
  MaxLength extends number,
  Acc extends string = '',
  Prev extends string = '',
  N extends any[] = []
> = N['length'] extends MaxLength
  ? Acc
  : Acc | {
  [K in T]: K extends Prev
    ? never
    : GenerateCombinationsFromString<T, MaxLength, `${Acc}${K}`, K, [any, ...N]>
}[T];

export type OneToSeven = "1" | "2" | "3" | "4" | "5" | "6" | "7"
export type OneToNine = OneToSeven | "8" | "9"
export type PaiGroupManzu = "m"
export type PaiGroupPinzu = "p"
export type PaiGroupSouzu = "s"
export type PaiGroupJi = "z"
export type PaiGroupSuuPai = PaiGroupManzu | PaiGroupPinzu | PaiGroupSouzu
export type PaiGroupName = PaiGroupSuuPai | PaiGroupJi

// NOTE: The a is an Aka Dora, f is a Furo
export type PaiAttr = GenerateCombinationsFromString<"a" | "f" | "", 3>

export type PaiNormal<T extends OneToNine, K extends PaiGroupSuuPai, U extends PaiAttr = ""> = `${T}${K}${U}`
export type PaiJi<T extends OneToSeven, U extends PaiAttr = ""> = `${T}z${U}`
export type Pai<T extends OneToNine, K extends PaiGroupName, U extends PaiAttr = ""> = K extends PaiGroupJi
  ? (
    T extends OneToSeven
      ? PaiJi<T, U>
      : never
    )
  : (
    K extends PaiGroupSuuPai
      ? PaiNormal<T, K, U>
      : never
    )

export type PaiList<K extends PaiGroupName> = Pai<"1", K> | Pai<"2", K> | Pai<"3", K> | Pai<"4", K>
  | Pai<"5", K>
  | Pai<"6", K> | Pai<"7", K> | Pai<"8", K> | Pai<"9", K>

  // NOTE: Akadora
  | Pai<"5", K, "a">

  // NOTE: Furo
  | Pai<"1", K, "f"> | Pai<"2", K, "f"> | Pai<"3", K, "f"> | Pai<"4", K, "f">
  | Pai<"5", K, "f"> | Pai<"5", K, "af">
  | Pai<"6", K, "f"> | Pai<"7", K, "f"> | Pai<"8", K, "f"> | Pai<"9", K, "f">

export type PaiManzuName = PaiList<"m">;
export type PaiPinzuName = PaiList<"p">;
export type PaiSouzuName = PaiList<"s">;
export type PaiKazeName = Pai<"1", "z"> | Pai<"2", "z"> | Pai<"3", "z"> | Pai<"4", "z">
  | Pai<"1", "z", "f"> | Pai<"2", "z", "f"> | Pai<"3", "z", "f"> | Pai<"4", "z", "f">;
export type PaiSangenName = Pai<"5", "z"> | Pai<"6", "z"> | Pai<"7", "z">
  | Pai<"5", "z", "f"> | Pai<"6", "z", "f"> | Pai<"7", "z", "f">;

export type PaiName = PaiManzuName | PaiPinzuName | PaiSouzuName | PaiKazeName | PaiSangenName;

export type PaiNamePattern = Record<PaiGroupName, { name: string, patterns?: Partial<Record<PaiName, string>> }>;
export type PaiNumberName = { "1": "一", "2": "二", "3": "三", "4": "四", "5": "五", "6": "六", "7": "七", "8": "八", "9": "九" }

export type KokushiMusou13 = ["1m", "9m", "1p", "9p", "1s", "9s", "1z", "2z", "3z", "4z", "5z", "6z", "7z"];
export type KokushiMusou = ["1m", ...KokushiMusou13] | ["9m", ...KokushiMusou13]
  | ["1p", ...KokushiMusou13] | ["9p", ...KokushiMusou13]
  | ["1s", ...KokushiMusou13] | ["9s", ...KokushiMusou13]
  | ["1z", ...KokushiMusou13] | ["2z", ...KokushiMusou13] | ["3z", ...KokushiMusou13] | ["4z", ...KokushiMusou13] | ["5z", ...KokushiMusou13] | ["6z", ...KokushiMusou13] | ["7z", ...KokushiMusou13];

export type ShuntsuPattern<T extends PaiGroupName> = [`1${T}`, `2${T}`, `3${T}`]
  | [`2${T}`, `3${T}`, `4${T}`]
  | [`3${T}`, `4${T}`, `5${T}`]
  | [`4${T}`, `5${T}`, `6${T}`]
  | [`5${T}`, `6${T}`, `7${T}`]
  | [`6${T}`, `7${T}`, `8${T}`]
  | [`7${T}`, `8${T}`, `9${T}`]

export type Shuntsu = ShuntsuPattern<"m"> | ShuntsuPattern<"p"> | ShuntsuPattern<"s">;
export type Koutsu = Repeat<PaiName, 3>;
export type Toitsu = Repeat<PaiName, 2>;
export type Kan = Repeat<PaiName, 4>;

export type ChiiToitsu = [...Toitsu, ...Toitsu, ...Toitsu, ...Toitsu, ...Toitsu, ...Toitsu, ...Toitsu];

export type PaiPair = {
  isKokushi: false
  isChuren: false
  isJantou: boolean
  isToitsu: true
  isShuntsu: false
  isKoutsu: false
  isKan: false
  isFuro: false
  includeAkaDora: boolean
  pattern: Toitsu
} | {
  isKokushi: false
  isChuren: false
  isJantou: false
  isToitsu: false
  isShuntsu: true
  isKoutsu: false
  isKan: false
  isFuro: boolean
  includeAkaDora: boolean
  pattern: Shuntsu
} | {
  isKokushi: false
  isChuren: false
  isJantou: false
  isToitsu: false
  isShuntsu: false
  isKoutsu: true
  isKan: false
  isFuro: boolean
  includeAkaDora: boolean
  pattern: Koutsu
} | {
  isKokushi: false
  isChuren: false
  isJantou: false
  isToitsu: false
  isShuntsu: false
  isKoutsu: false
  isKan: true
  isFuro: boolean
  includeAkaDora: boolean
  pattern: Kan
} | {
  isKokushi: true
  isChuren: false
  isJantou: false
  isToitsu: false
  isShuntsu: false
  isKoutsu: false
  isKan: false
  isFuro: false
  includeAkaDora: boolean
  pattern: PaiName[]
} | {
  isKokushi: false
  isChuren: true
  isJantou: false
  isToitsu: false
  isShuntsu: false
  isKoutsu: false
  isKan: false
  isFuro: false
  includeAkaDora: boolean
  pattern: PaiName[]
} | {
  isKokushi: false
  isChuren: false
  isJantou: false
  isToitsu: false
  isShuntsu: false
  isKoutsu: false
  isKan: false
  isFuro: false
  includeAkaDora: boolean
  pattern: PaiName[]
};

export type Chii = Shuntsu;
export type Pon = Koutsu;
export type Furo = Chii | Pon | Kan;

export interface Hora {
  pai: PaiName
  fromRon: boolean
  fromTsumo: boolean
  fromRinshanPai: boolean
}

export interface SystemOption {
  logger: (...message: string[]) => void,
}

export interface MahjongOption extends SystemOption {
  hora: Hora
  honba: number
  kaze: Pai<"1", "z"> | Pai<"2", "z"> | Pai<"3", "z"> | Pai<"4", "z">
  jikaze: Pai<"1", "z"> | Pai<"2", "z"> | Pai<"3", "z"> | Pai<"4", "z">
  uraDoraList: PaiName[]
  doraList: PaiName[]
  localRules: {
    fu: {
      renfonPai: number,
    },
    honba: number,
    kuitan: boolean,
  },
  fuList: (new (...args: any[]) => Fu)[]
  yakuList: (new (...args: any[]) => Yaku)[]
  enableDoubleYakuman: boolean
  additionalSpecialYaku: {
    // NOTE: Here is not available to calculate automatically
    //       Because it is not enough information by passed parameters only.
    //       There requires information of Yama and Kawa.
    //       Therefore, there are optionized.
    withRiichi: boolean
    withDoubleRiichi: boolean
    withOpenRiichi: boolean
    withIppatsu: boolean
    withHaitei: boolean
    withHoutei: boolean
    withChanKan: boolean
    withTenho: boolean
    withChiho: boolean
    withNagashiMangan: boolean
  }
}

export interface Yaku {
  parent?: Yaku;
  han?: number
  calculationBasedHan?: number
  type: 'NORMAL' | 'FULL' | 'DOUBLE_FULL'
  availableHora?: boolean
  isFulfilled: boolean
}

export interface Fu {
  value: number,
  isFulfilled: boolean,
}

export type ScoreYaku = {
  isYaku: true
  yaku: Yaku
}

export type ScoreFu = {
  isYaku: false
  fu: Fu
}

export type Score = ScoreYaku | ScoreFu

export interface Validator {
  validate: () => boolean
}

export type PaiGroup<T = PaiName> = { m: T[], p: T[], s: T[], z: T[] }

export type CalculatedScore = {
  isYakuman: false
  isDoubleYakuman: false
  isFu: true
  name: string
  score: number
  calculationBasedScore?: number
} | {
  isYakuman: false
  isDoubleYakuman: false
  isFu: false
  name: string
  score: number
  calculationBasedScore?: number
} | {
  isYakuman: true
  isDoubleYakuman: false
  isFu: false
  name: string
  calculationBasedScore?: number
} | {
  isYakuman: false
  isDoubleYakuman: true
  isFu: false
  name: string
  calculationBasedScore?: number
}

export type ScoreData = {
  score: { base: number, parent?: number, child?: number }
  fu: number | null
  yaku: number | 'FULL' | 'DOUBLE_FULL'
  honba: number
  appliedFuList: CalculatedScore[]
  appliedYakuList: CalculatedScore[]
}

export type PlayStyle = '4ma' | '3ma';

export default {}
