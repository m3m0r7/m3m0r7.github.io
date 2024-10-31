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
  AkaDora, ChanFon,
  Chanta,
  Dora,
  Haitei,
  Honitsu,
  Houtei,
  Ippatsu, MenFon,
  OpenRiichi,
  Pinfu, RenFon,
  Riichi,
  RinshanKaiho,
  Tanyao, UraDora
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
  ],
}
