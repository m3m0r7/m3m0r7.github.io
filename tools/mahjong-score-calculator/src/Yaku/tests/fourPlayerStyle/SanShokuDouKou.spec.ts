import "../../../Utilities/Utilities";
import { describe, expect, test } from "vitest";
import { Mahjong } from "../../../Runtime/Mahjong";
import I18n from "../../../Lang/I18n";
import { PaiName } from "../../../@types/types";
import {
  Ankou,
  ChanFonPai,
  Futei,
  MenzenKafu,
  Minkou,
  RenFonPai,
  Tsumo,
} from "../../../Fu";
import { SanShokuDouKou } from "../../SanShokuDouKou";
import { SanAnkou } from "../../SanAnkou";
import { MenzenTsumo } from "../../MenzenTsumo";

const sanShokuDouKouExampleFormat: PaiName[] = [
  "2m",
  "2m",
  "2m",
  "2p",
  "2p",
  "2p",

  "2s",
  "2s",
  "2s",
  "6p",
  "7p",
  "8p",

  "1z",
  "1z",
];

describe("SanShokuDouKou", () => {
  describe("fulfilled", () => {
    describe("parent", () => {
      test("tsumo", () => {
        const score = new Mahjong(sanShokuDouKouExampleFormat, {
          hora: {
            pai: "2s",
            fromTsumo: true,
            fromRon: false,

            fromRinshanPai: false,
          },

          // NOTE: Here is same of a mahjong parent
          jikaze: "1z",
          kaze: "1z",
        }).score.fourPlayerStyleScore;

        expect(score?.score).deep.eq({ base: 12000, child: 4000 });
        expect(score?.honba).eq(0);
        expect(score?.fu).eq(40);
        expect(score?.yaku).eq(5);
        expect(score?.appliedFuList).deep.eq([
          {
            isDoubleYakuman: false,
            isFu: true,
            isYakuman: false,
            name: I18n.ja.fu[Futei.name],
            score: 20,
          },
          {
            isDoubleYakuman: false,
            isFu: true,
            isYakuman: false,
            name: I18n.ja.fu[Ankou.name],
            score: 12,
          },
          {
            isDoubleYakuman: false,
            isFu: true,
            isYakuman: false,
            name: I18n.ja.fu[Tsumo.name],
            score: 2,
          },
          {
            isDoubleYakuman: false,
            isFu: true,
            isYakuman: false,
            name: I18n.ja.fu[RenFonPai.name],
            score: 4,
          },
        ]);
        expect(score?.appliedYakuList).deep.eq([
          {
            isDoubleYakuman: false,
            isFu: false,
            isYakuman: false,
            name: I18n.ja.yaku[SanAnkou.name],
            score: 2,
            calculationBasedScore: 2,
          },
          {
            isDoubleYakuman: false,
            isFu: false,
            isYakuman: false,
            name: I18n.ja.yaku[SanShokuDouKou.name],
            score: 2,
            calculationBasedScore: 2,
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
        const score = new Mahjong(sanShokuDouKouExampleFormat, {
          hora: {
            pai: "2s",
            fromTsumo: false,
            fromRon: true,

            fromRinshanPai: false,
          },

          // NOTE: Here is same of a mahjong parent
          jikaze: "1z",
          kaze: "1z",
        }).score.fourPlayerStyleScore;

        expect(score?.score).deep.eq({ base: 12000 });
        expect(score?.honba).eq(0);
        expect(score?.fu).eq(50);
        expect(score?.yaku).eq(4);
        expect(score?.appliedFuList).deep.eq([
          {
            isDoubleYakuman: false,
            isFu: true,
            isYakuman: false,
            name: I18n.ja.fu[Futei.name],
            score: 20,
          },
          {
            isDoubleYakuman: false,
            isFu: true,
            isYakuman: false,
            name: I18n.ja.fu[Ankou.name],
            score: 12,
          },
          {
            isDoubleYakuman: false,
            isFu: true,
            isYakuman: false,
            name: I18n.ja.fu[MenzenKafu.name],
            score: 10,
          },
          {
            isDoubleYakuman: false,
            isFu: true,
            isYakuman: false,
            name: I18n.ja.fu[RenFonPai.name],
            score: 4,
          },
        ]);
        expect(score?.appliedYakuList).deep.eq([
          {
            isDoubleYakuman: false,
            isFu: false,
            isYakuman: false,
            name: I18n.ja.yaku[SanAnkou.name],
            score: 2,
            calculationBasedScore: 2,
          },
          {
            isDoubleYakuman: false,
            isFu: false,
            isYakuman: false,
            name: I18n.ja.yaku[SanShokuDouKou.name],
            score: 2,
            calculationBasedScore: 2,
          },
        ]);
      });
    });

    describe("child", () => {
      test("tsumo", () => {
        const score = new Mahjong(sanShokuDouKouExampleFormat, {
          hora: {
            pai: "2s",
            fromTsumo: true,
            fromRon: false,

            fromRinshanPai: false,
          },

          jikaze: "2z",
          kaze: "1z",
        }).score.fourPlayerStyleScore;

        expect(score?.score).deep.eq({ base: 8000, parent: 4000, child: 2000 });
        expect(score?.honba).eq(0);
        expect(score?.fu).eq(40);
        expect(score?.yaku).eq(5);
        expect(score?.appliedFuList).deep.eq([
          {
            isDoubleYakuman: false,
            isFu: true,
            isYakuman: false,
            name: I18n.ja.fu[Futei.name],
            score: 20,
          },
          {
            isDoubleYakuman: false,
            isFu: true,
            isYakuman: false,
            name: I18n.ja.fu[Ankou.name],
            score: 12,
          },
          {
            isDoubleYakuman: false,
            isFu: true,
            isYakuman: false,
            name: I18n.ja.fu[Tsumo.name],
            score: 2,
          },
          {
            isDoubleYakuman: false,
            isFu: true,
            isYakuman: false,
            name: I18n.ja.fu[ChanFonPai.name],
            score: 2,
          },
        ]);
        expect(score?.appliedYakuList).deep.eq([
          {
            isDoubleYakuman: false,
            isFu: false,
            isYakuman: false,
            name: I18n.ja.yaku[SanAnkou.name],
            score: 2,
            calculationBasedScore: 2,
          },
          {
            isDoubleYakuman: false,
            isFu: false,
            isYakuman: false,
            name: I18n.ja.yaku[SanShokuDouKou.name],
            score: 2,
            calculationBasedScore: 2,
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
        const score = new Mahjong(sanShokuDouKouExampleFormat, {
          hora: {
            pai: "2s",
            fromTsumo: false,
            fromRon: true,

            fromRinshanPai: false,
          },

          jikaze: "2z",
          kaze: "1z",
        }).score.fourPlayerStyleScore;

        expect(score?.score).deep.eq({ base: 8000 });
        expect(score?.honba).eq(0);
        expect(score?.fu).eq(50);
        expect(score?.yaku).eq(4);
        expect(score?.appliedFuList).deep.eq([
          {
            isDoubleYakuman: false,
            isFu: true,
            isYakuman: false,
            name: I18n.ja.fu[Futei.name],
            score: 20,
          },
          {
            isDoubleYakuman: false,
            isFu: true,
            isYakuman: false,
            name: I18n.ja.fu[Ankou.name],
            score: 12,
          },
          {
            isDoubleYakuman: false,
            isFu: true,
            isYakuman: false,
            name: I18n.ja.fu[MenzenKafu.name],
            score: 10,
          },
          {
            isDoubleYakuman: false,
            isFu: true,
            isYakuman: false,
            name: I18n.ja.fu[ChanFonPai.name],
            score: 2,
          },
        ]);
        expect(score?.appliedYakuList).deep.eq([
          {
            isDoubleYakuman: false,
            isFu: false,
            isYakuman: false,
            name: I18n.ja.yaku[SanAnkou.name],
            score: 2,
            calculationBasedScore: 2,
          },
          {
            isDoubleYakuman: false,
            isFu: false,
            isYakuman: false,
            name: I18n.ja.yaku[SanShokuDouKou.name],
            score: 2,
            calculationBasedScore: 2,
          },
        ]);
      });

      test("with furo", () => {
        const mahjong = new Mahjong(sanShokuDouKouExampleFormat, {
          hora: {
            pai: "2s",
            fromTsumo: false,
            fromRon: true,

            fromRinshanPai: false,
          },

          jikaze: "2z",
          kaze: "1z",
        });

        mahjong.updatePaiPairCollections((paiPairCollection) => {
          paiPairCollection.paiPairs.map((paiPair) => {
            paiPair.isFuro = true;
            return paiPair;
          });
          return paiPairCollection;
        });

        const score = mahjong.score.fourPlayerStyleScore;
        expect(score?.score).deep.eq({ base: 2000 });
        expect(score?.honba).eq(0);
        expect(score?.fu).eq(30);
        expect(score?.yaku).eq(2);
        expect(score?.appliedFuList).deep.eq([
          {
            isDoubleYakuman: false,
            isFu: true,
            isYakuman: false,
            name: I18n.ja.fu[Futei.name],
            score: 20,
          },
          {
            isDoubleYakuman: false,
            isFu: true,
            isYakuman: false,
            name: I18n.ja.fu[Minkou.name],
            score: 6,
          },
          {
            isDoubleYakuman: false,
            isFu: true,
            isYakuman: false,
            name: I18n.ja.fu[ChanFonPai.name],
            score: 2,
          },
        ]);
        expect(score?.appliedYakuList).deep.eq([
          {
            isDoubleYakuman: false,
            isFu: false,
            isYakuman: false,
            name: I18n.ja.yaku[SanShokuDouKou.name],
            score: 2,
            calculationBasedScore: 2,
          },
        ]);
      });
    });
  });
});
