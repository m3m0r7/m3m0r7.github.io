import "../../../Utilities/Utilities";
import { describe, expect, test } from "vitest";
import { Mahjong } from "../../../Runtime/Mahjong";
import I18n from "../../../Lang/I18n";
import { PaiName } from "../../../@types/types";
import { RyanPeiKou } from "../../RyanPeiKou";
import { Ankou, Futei, MenzenKafu, Tsumo } from "../../../Fu";
import { MenzenTsumo } from "../../MenzenTsumo";

const ryanPeiKouExampleFormat: PaiName[] = [
  "1m",
  "1m",
  "1m",
  "2m",
  "2m",
  "2m",
  "3m",
  "3m",
  "3m",
  "2p",
  "3p",
  "4p",

  "2s",
  "2s",
];

describe("RyanPeiKou", () => {
  describe("fulfilled", () => {
    describe("parent", () => {
      test("tsumo", () => {
        const score = new Mahjong(ryanPeiKouExampleFormat, {
          hora: {
            pai: "2s",
            fromTsumo: true,
            fromRon: false,

            fromRinshanPai: false,
          },

          // NOTE: Here is same of a mahjong parent
          jikaze: "1z",
          kaze: "1z",
        }).calculator.value;

        expect(score?.score).deep.eq({ base: 11600, child: 3900 });
        expect(score?.fu).eq(30);
        expect(score?.yaku).eq(4);
        expect(score?.appliedFuList).deep.eq([
          {
            isYakuman: false,
            isDoubleYakuman: false,
            isFu: true,
            name: I18n.ja.fu[Futei.name],
            score: 20,
          },
          {
            isYakuman: false,
            isDoubleYakuman: false,
            isFu: true,
            name: I18n.ja.fu[Tsumo.name],
            score: 2,
          },
        ]);
        expect(score?.appliedYakuList).deep.eq([
          {
            isDoubleYakuman: false,
            isFu: false,
            isYakuman: false,
            name: I18n.ja.yaku[RyanPeiKou.name],
            score: 3,
            calculationBasedScore: 3,
          },
          {
            isDoubleYakuman: false,
            isFu: false,
            isYakuman: false,
            name: I18n.ja.yaku[MenzenTsumo.name],
            score: 1,
            calculationBasedScore: 1,
          },
        ]);
      });
      test("ron", () => {
        const score = new Mahjong(ryanPeiKouExampleFormat, {
          hora: {
            pai: "2s",
            fromTsumo: false,
            fromRon: true,

            fromRinshanPai: false,
          },

          // NOTE: Here is same of a mahjong parent
          jikaze: "1z",
          kaze: "1z",
        }).calculator.value;

        expect(score?.score).deep.eq({ base: 5800 });
        expect(score?.honba).eq(0);
        expect(score?.fu).eq(30);
        expect(score?.yaku).eq(3);
        expect(score?.appliedFuList).deep.eq([
          {
            isYakuman: false,
            isDoubleYakuman: false,
            isFu: true,
            name: I18n.ja.fu[Futei.name],
            score: 20,
          },
          {
            isYakuman: false,
            isDoubleYakuman: false,
            isFu: true,
            name: I18n.ja.fu[MenzenKafu.name],
            score: 10,
          },
        ]);
        expect(score?.appliedYakuList).deep.eq([
          {
            isDoubleYakuman: false,
            isFu: false,
            isYakuman: false,
            name: I18n.ja.yaku[RyanPeiKou.name],
            score: 3,
            calculationBasedScore: 3,
          },
        ]);
      });
    });

    describe("child", () => {
      test("tsumo", () => {
        const score = new Mahjong(ryanPeiKouExampleFormat, {
          hora: {
            pai: "2s",
            fromTsumo: true,
            fromRon: false,

            fromRinshanPai: false,
          },

          jikaze: "2z",
          kaze: "1z",
        }).calculator.value;

        expect(score?.score).deep.eq({ base: 7700, parent: 3900, child: 2000 });
        expect(score?.honba).eq(0);
        expect(score?.fu).eq(30);
        expect(score?.yaku).eq(4);
        expect(score?.appliedFuList).deep.eq([
          {
            isYakuman: false,
            isDoubleYakuman: false,
            isFu: true,
            name: I18n.ja.fu[Futei.name],
            score: 20,
          },
          {
            isYakuman: false,
            isDoubleYakuman: false,
            isFu: true,
            name: I18n.ja.fu[Tsumo.name],
            score: 2,
          },
        ]);
        expect(score?.appliedYakuList).deep.eq([
          {
            isDoubleYakuman: false,
            isFu: false,
            isYakuman: false,
            name: I18n.ja.yaku[RyanPeiKou.name],
            score: 3,
            calculationBasedScore: 3,
          },
          {
            isDoubleYakuman: false,
            isFu: false,
            isYakuman: false,
            name: I18n.ja.yaku[MenzenTsumo.name],
            score: 1,
            calculationBasedScore: 1,
          },
        ]);
      });
      test("ron", () => {
        const score = new Mahjong(ryanPeiKouExampleFormat, {
          hora: {
            pai: "2s",
            fromTsumo: false,
            fromRon: true,

            fromRinshanPai: false,
          },

          jikaze: "2z",
          kaze: "1z",
        }).calculator.value;

        expect(score?.score).deep.eq({ base: 3900 });
        expect(score?.honba).eq(0);
        expect(score?.fu).eq(30);
        expect(score?.yaku).eq(3);
        expect(score?.appliedFuList).deep.eq([
          {
            isYakuman: false,
            isDoubleYakuman: false,
            isFu: true,
            name: I18n.ja.fu[Futei.name],
            score: 20,
          },
          {
            isYakuman: false,
            isDoubleYakuman: false,
            isFu: true,
            name: I18n.ja.fu[MenzenKafu.name],
            score: 10,
          },
        ]);
        expect(score?.appliedYakuList).deep.eq([
          {
            isDoubleYakuman: false,
            isFu: false,
            isYakuman: false,
            name: I18n.ja.yaku[RyanPeiKou.name],
            score: 3,
            calculationBasedScore: 3,
          },
        ]);
      });
    });
  });
});
