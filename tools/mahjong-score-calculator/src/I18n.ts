import {
  AkaDora, ChanFon, ChanKan,
  Chanta, Chun, Dora,
  Haitei, Haku, Hatsu,
  Honitsu,
  Houtei, IpeiKou, Ippatsu, MenFon,
  OpenRiichi,
  Pinfu,
  RenFon,
  Riichi,
  RinshanKaiho, RyanPeiKou,
  Tanyao, UraDora
} from "./Yaku";
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

export default {
  ja: {
    fu: {
      [Futei.name]: '副底',
      [Ankou.name]: '暗刻',
      [Minkou.name]: '明刻',
      [Ankan.name]: '暗槓',
      [Minkan.name]: '明槓',
      [Tsumo.name]: 'ツモ符',
      [MenzenKafu.name]: '門前加付',
      [MenFonPai.name]: '自風牌',
      [ChanFonPai.name]: '場風牌',
      [SangenPai.name]: '三元牌',
      [RenFonPai.name]: '連風牌',
    },
    yaku: {
      [Tanyao.name]: '断么九',
      [Chanta.name]: '混全帯么九',
      [Honitsu.name]: '混一色',
      [Pinfu.name]: '平和',
      [Houtei.name]: '河底撈魚',
      [Haitei.name]: '海底摸月',
      [Riichi.name]: 'リーチ',
      [OpenRiichi.name]: 'オープンリーチ',
      [RinshanKaiho.name]: '嶺上開花',
      [RenFon.name]: 'ダブル風役',
      [ChanFon.name]: '場風役',
      [MenFon.name]: '自風役',
      [Ippatsu.name]: '一発',
      [Haku.name]: '白',
      [Hatsu.name]: '発',
      [Chun.name]: '中',
      [ChanKan.name]: '槍槓',
      [IpeiKou.name]: '一盃口',
      [RyanPeiKou.name]: '二盃口',
      [Dora.name]: 'ドラ',
      [UraDora.name]: '裏ドラ',
      [AkaDora.name]: '赤ドラ',
    }
  }
}
