import {
  Ankan,
  Ankou,
  ChanFonPai,
  Futei,
  MenFonPai,
  MenzenKafu,
  Minkan,
  Minkou,
  RenFonPai,
  SangenPai,
  Tsumo
} from "../Fu";
import {
  AkaDora,
  ChanFon,
  ChanKan,
  Chanta,
  Chiho,
  ChiiToitsu,
  ChinRoutou,
  Chun,
  ChurenPoutou,
  DaiSanGen,
  DaiSushi,
  Dora,
  Haitei,
  Haku,
  Hatsu,
  Honitsu, HonRoutou,
  Houtei,
  IpeiKou,
  Ippatsu,
  JunseiChurenPoutou,
  KokushiMusou,
  KokushiMusou13MenMachi,
  MenFon,
  NagashiMangan,
  OpenRiichi,
  Pinfu,
  RenFon,
  Riichi,
  RinshanKaihou,
  RyanPeiKou,
  RyuIsou,
  SanAnkou,
  SanShokuDouJun,
  SanShokuDouKou,
  ShouSushi,
  SuAnkou,
  SuAnkouTankiMachi,
  SuKantsu,
  Tanyao,
  Tenho,
  ToiToi,
  TsuIsou,
  UraDora
} from "../Yaku";
import { MahjongOption } from "../@types/types";

export const MahjongDefaultAdditionalSpecialYaku: MahjongOption['additionalSpecialYaku'] = {
  withRiichi: false,
  withDoubleRiichi: false,
  withOpenRiichi: false,
  withIppatsu: false,
  withHaitei: false,
  withHoutei: false,
  withChanKan: false,
  withTenho: false,
  withChiho: false,
  withNagashiMangan: false,
}

export const MahjongDefaultLocalRules: MahjongOption['localRules'] = {
  fu: {
    renfonPai: 4,
  },
  honba: 300,
  kuitan: true,
}

// NOTE: The other property will be merged
export const MahjongDefaultOption: Partial<MahjongOption> = {
  localRules: MahjongDefaultLocalRules,
  additionalSpecialYaku: MahjongDefaultAdditionalSpecialYaku,
  fuList: [
    Futei,
    Ankou,
    Minkou,
    Ankan,
    Minkan,
    Tsumo,
    MenzenKafu,
    MenFonPai,
    ChanFonPai,
    SangenPai,
    RenFonPai,
  ],
  yakuList: [
    // NOTE: Double Yakuman
    //       Here order is needed.
    KokushiMusou13MenMachi,
    SuAnkouTankiMachi,
    DaiSushi,
    JunseiChurenPoutou,

    // NOTE: Here is highly ordered yakuman because the processor will firstly hit to SuAnkou
    RyuIsou,
    Tenho,
    Chiho,
    ShouSushi,
    DaiSanGen,
    TsuIsou,
    ChinRoutou,

    // NOTE: Yakuman
    SuKantsu,
    SuAnkou,
    KokushiMusou,
    ChurenPoutou,

    // NOTE: Normally yaku
    ChanKan,
    HonRoutou,
    Tanyao,
    Chanta,
    Honitsu,
    Pinfu,
    Houtei,
    Haitei,
    Riichi,
    OpenRiichi,
    RinshanKaihou,
    RenFon,
    ChanFon,
    MenFon,
    Ippatsu,
    Dora,
    UraDora,
    AkaDora,
    Haku,
    Hatsu,
    Chun,
    IpeiKou,
    ToiToi,
    SanAnkou,
    SanShokuDouKou,
    SanShokuDouJun,
    NagashiMangan,
    ChiiToitsu,
  ],
}