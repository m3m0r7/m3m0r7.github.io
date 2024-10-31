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
} from "./Fu";
import {
  AkaDora,
  ChanFon,
  ChanKan,
  Chanta, Chiho,
  ChinRoutou,
  Chun,
  Dora,
  Haitei,
  Haku,
  Hatsu,
  Honitsu,
  Houtei,
  IpeiKou,
  Ippatsu, KokushiMusou, KokushiMusou13MenMachi,
  MenFon,
  OpenRiichi,
  Pinfu,
  RenFon,
  Riichi,
  RinshanKaiho,
  RyanPeiKou,
  SanAnkou,
  SanShokuDouJun,
  SanShokuDouKou,
  SuAnkou,
  SuKantsu,
  Tanyao, Tenho,
  ToiToi,
  TsuIsou,
  UraDora
} from "./Yaku";
import { MahjongOption } from "./types";

// NOTE: The other property will be merged
export const MahjongDefaultOption: Partial<MahjongOption> = {
  localRules: {
    fu: {
      renfonPai: 4,
    },
    honba: 0,
  },
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

    // NOTE: Yakuman
    SuAnkou,
    ChinRoutou,
    SuKantsu,
    TsuIsou,
    Tenho,
    Chiho,
    KokushiMusou,

    // NOTE: Normally yaku
    Tanyao,
    Chanta,
    Honitsu,
    Pinfu,
    Houtei,
    Haitei,
    Riichi,
    OpenRiichi,
    RinshanKaiho,
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
    ChanKan,
    IpeiKou,
    RyanPeiKou,
    ToiToi,
    SanAnkou,
    SanShokuDouKou,
    SanShokuDouJun,
  ],
}
