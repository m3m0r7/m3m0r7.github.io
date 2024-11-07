import "../../../Utilities/Utilities";
import { describe, expect, test } from "vitest";
import { Mahjong } from "../../../Runtime/Mahjong";
import I18n from "../../../Lang/I18n";
import { PaiName } from "../../../@types/types";
import { PaRenChan } from "../../PaRenChan";

const paRenChanExampleFormat: PaiName[] = [
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

describe("PaRenChan", () => {
  describe("fulfilled", () => {
    describe("parent", () => {
      test("tsumo", () => {
        const score = new Mahjong(paRenChanExampleFormat, {
          hora: {
            pai: "2s",
            fromTsumo: true,
            fromRon: false,

            fromRinshanPai: false,
          },

          // NOTE: Here is same of a mahjong parent
          jikaze: "1z",
          kaze: "1z",

          honba: 8,
        }).calculator.value;

        expect(score?.score).deep.eq({ base: 48000, child: 16000 });
        expect(score?.honba).eq(8);
        expect(score?.fu).eq(null);
        expect(score?.yaku).eq("FULL");
        expect(score?.appliedFuList).deep.eq([]);
        expect(score?.appliedYakuList).deep.eq([
          {
            isDoubleYakuman: false,
            isFu: false,
            isYakuman: true,
            name: I18n.ja.yaku[PaRenChan.name],
          },
        ]);
      });
      test("ron", () => {
        const score = new Mahjong(paRenChanExampleFormat, {
          hora: {
            pai: "2s",
            fromTsumo: false,
            fromRon: true,

            fromRinshanPai: false,
          },

          // NOTE: Here is same of a mahjong parent
          jikaze: "1z",
          kaze: "1z",

          honba: 8,
        }).calculator.value;

        expect(score?.score).deep.eq({ base: 48000 });
        expect(score?.honba).eq(8);
        expect(score?.fu).eq(null);
        expect(score?.yaku).eq("FULL");
        expect(score?.appliedFuList).deep.eq([]);
        expect(score?.appliedYakuList).deep.eq([
          {
            isDoubleYakuman: false,
            isFu: false,
            isYakuman: true,
            name: I18n.ja.yaku[PaRenChan.name],
          },
        ]);
      });
    });

    describe("child", () => {
      test("tsumo", () => {
        const score = new Mahjong(paRenChanExampleFormat, {
          hora: {
            pai: "2s",
            fromTsumo: true,
            fromRon: false,

            fromRinshanPai: false,
          },

          jikaze: "2z",
          kaze: "1z",

          honba: 8,
        }).calculator.value;

        expect(score?.score).deep.eq({
          base: 32000,
          parent: 16000,
          child: 8000,
        });
        expect(score?.honba).eq(8);
        expect(score?.fu).eq(null);
        expect(score?.yaku).eq("FULL");
        expect(score?.appliedFuList).deep.eq([]);
        expect(score?.appliedYakuList).deep.eq([
          {
            isDoubleYakuman: false,
            isFu: false,
            isYakuman: true,
            name: I18n.ja.yaku[PaRenChan.name],
          },
        ]);
      });
      test("ron", () => {
        const score = new Mahjong(paRenChanExampleFormat, {
          hora: {
            pai: "2s",
            fromTsumo: false,
            fromRon: true,

            fromRinshanPai: false,
          },

          jikaze: "2z",
          kaze: "1z",

          honba: 8,
        }).calculator.value;

        expect(score?.score).deep.eq({ base: 32000 });
        expect(score?.honba).eq(8);
        expect(score?.fu).eq(null);
        expect(score?.yaku).eq("FULL");
        expect(score?.appliedFuList).deep.eq([]);
        expect(score?.appliedYakuList).deep.eq([
          {
            isDoubleYakuman: false,
            isFu: false,
            isYakuman: true,
            name: I18n.ja.yaku[PaRenChan.name],
          },
        ]);
      });

      test("with furo", () => {
        const mahjong = new Mahjong(paRenChanExampleFormat, {
          hora: {
            pai: "2s",
            fromTsumo: false,
            fromRon: true,

            fromRinshanPai: false,
          },

          jikaze: "2z",
          kaze: "1z",

          honba: 8,
        });

        mahjong.updatePaiPairCollections((paiPairCollection) => {
          paiPairCollection.paiPairs.map((paiPair) => {
            paiPair.isFuro = true;
            return paiPair;
          });
          return paiPairCollection;
        });

        const score = mahjong.calculator.value;

        expect(score?.score).deep.eq({ base: 32000 });
        expect(score?.honba).eq(8);
        expect(score?.fu).eq(null);
        expect(score?.yaku).eq("FULL");
        expect(score?.appliedFuList).deep.eq([]);
        expect(score?.appliedYakuList).deep.eq([
          {
            isDoubleYakuman: false,
            isFu: false,
            isYakuman: true,
            name: I18n.ja.yaku[PaRenChan.name],
          },
        ]);
      });
    });
  });
});
