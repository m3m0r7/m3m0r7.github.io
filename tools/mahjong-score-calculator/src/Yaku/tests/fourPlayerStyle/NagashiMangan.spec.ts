import "../../../Utilities/Utilities";
import { describe, expect, test } from "vitest";
import { Mahjong } from "../../../Runtime/Mahjong";
import I18n from "../../../Lang/I18n";
import { PaiName } from "../../../@types/types";
import { Futei, MenzenKafu, Tsumo } from "../../../Fu";
import { NagashiMangan } from "../../NagashiMangan";
import {
  MahjongDefaultAdditionalSpecialYaku,
  MahjongDefaultLocalRules,
} from "../../../Runtime/MahjongDefaultOption";

const nagashiManganExampleFormat: PaiName[] = [
  "1m",
  "2m",
  "3m",
  "5m",
  "6m",
  "7m",

  "3p",
  "4p",
  "5p",
  "6p",
  "7p",
  "8p",

  "2s",
  "2s",
];

describe("NagashiMangan", () => {
  describe("fulfilled", () => {
    describe("parent", () => {
      test("tsumo", () => {
        const score = new Mahjong(nagashiManganExampleFormat, {
          hora: {
            pai: "2s",
            fromTsumo: true,
            fromRon: false,

            fromRinshanPai: false,
          },

          additionalSpecialYaku: {
            ...MahjongDefaultAdditionalSpecialYaku,
            withNagashiMangan: true,
          },

          // NOTE: Here is same of a mahjong parent
          jikaze: "1z",
          kaze: "1z",
        }).calculator.value;

        expect(score?.score).deep.eq({ base: 12000, child: 4000 });
        expect(score?.honba).eq(0);
        expect(score?.fu).eq(null);
        expect(score?.yaku).eq(4);
        expect(score?.appliedFuList).deep.eq([]);
        expect(score?.appliedYakuList).deep.eq([
          {
            isDoubleYakuman: false,
            isFu: false,
            isYakuman: false,
            name: I18n.ja.yaku[NagashiMangan.name],
            score: 4,
            calculationBasedScore: 5,
          },
        ]);
      });
      test("ron", () => {
        const score = new Mahjong(nagashiManganExampleFormat, {
          hora: {
            pai: "2s",
            fromTsumo: false,
            fromRon: true,

            fromRinshanPai: false,
          },

          additionalSpecialYaku: {
            ...MahjongDefaultAdditionalSpecialYaku,
            withNagashiMangan: true,
          },

          // NOTE: Here is same of a mahjong parent
          jikaze: "1z",
          kaze: "1z",
        }).calculator.value;

        expect(score?.score).deep.eq({ base: 12000 });
        expect(score?.honba).eq(0);
        expect(score?.fu).eq(null);
        expect(score?.yaku).eq(4);
        expect(score?.appliedFuList).deep.eq([]);
        expect(score?.appliedYakuList).deep.eq([
          {
            isDoubleYakuman: false,
            isFu: false,
            isYakuman: false,
            name: I18n.ja.yaku[NagashiMangan.name],
            score: 4,
            calculationBasedScore: 5,
          },
        ]);
      });
    });

    describe("child", () => {
      test("tsumo", () => {
        const score = new Mahjong(nagashiManganExampleFormat, {
          hora: {
            pai: "2s",
            fromTsumo: true,
            fromRon: false,

            fromRinshanPai: false,
          },

          additionalSpecialYaku: {
            ...MahjongDefaultAdditionalSpecialYaku,
            withNagashiMangan: true,
          },

          jikaze: "2z",
          kaze: "1z",
        }).calculator.value;

        expect(score?.score).deep.eq({ base: 8000, parent: 4000, child: 2000 });
        expect(score?.honba).eq(0);
        expect(score?.fu).eq(null);
        expect(score?.yaku).eq(4);
        expect(score?.appliedFuList).deep.eq([]);
        expect(score?.appliedYakuList).deep.eq([
          {
            isDoubleYakuman: false,
            isFu: false,
            isYakuman: false,
            name: I18n.ja.yaku[NagashiMangan.name],
            score: 4,
            calculationBasedScore: 5,
          },
        ]);
      });
      test("ron", () => {
        const score = new Mahjong(nagashiManganExampleFormat, {
          hora: {
            pai: "2s",
            fromTsumo: false,
            fromRon: true,

            fromRinshanPai: false,
          },

          additionalSpecialYaku: {
            ...MahjongDefaultAdditionalSpecialYaku,
            withNagashiMangan: true,
          },

          jikaze: "2z",
          kaze: "1z",
        }).calculator.value;

        expect(score?.score).deep.eq({ base: 8000 });
        expect(score?.honba).eq(0);
        expect(score?.fu).eq(null);
        expect(score?.yaku).eq(4);
        expect(score?.appliedFuList).deep.eq([]);
        expect(score?.appliedYakuList).deep.eq([
          {
            isDoubleYakuman: false,
            isFu: false,
            isYakuman: false,
            name: I18n.ja.yaku[NagashiMangan.name],
            score: 4,
            calculationBasedScore: 5,
          },
        ]);
      });
    });
  });
});
