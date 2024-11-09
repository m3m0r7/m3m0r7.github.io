import React, { useContext } from "react";
import DialogContext, { DialogType } from "../../Context/DialogContext";
import PaiSelectionContext from "../../Context/PaiSelectionContext";
import OptionContext from "../../Context/OptionContext";
import ScoreDataContext from "../../Context/ScoreDataContext";
import CalculationStepContext from "../../Context/CalculationStepContext";
import { PaiName } from "../../../@types/types";
import { PaiGenerator } from "../../../Utilities/PaiGenerator";

const name: DialogType["openType"] = "input-support";

const DialogInputSupport = () => {
  const [calculationStep, setCalculationStep] = useContext(
    CalculationStepContext,
  );
  const [dialog, setDialog] = useContext(DialogContext);
  const [paiSelections, setPaiSelections] = useContext(PaiSelectionContext);
  const [option, setOption] = useContext(OptionContext);
  const [scoreData, setScoreData] = useContext(ScoreDataContext);

  if (!dialog || !setDialog || !dialog.open || name !== dialog.openType) {
    return null;
  }

  const applyTanyao = () => {
    const paiList = [
      ...(option?.playStyle === 3
        ? ["2s", "3s", "4s", "5s", "6s", "7s"]
        : ["2m", "3m", "4m", "5m", "6m", "7m"]),

      "3p",
      "4p",
      "5p",
      "6p",
      "7p",
      "8p",

      "2s",
      "2s",
    ].map((pai) => ({
      index: 0,
      isFuro: false,
      isHoraPai: false,
      isDoraPai: false,
      isAkaDora: false,
      isUraDoraPai: false,
      isKanPai: false,
      pai: pai as PaiName,
    }));
    paiList[0].isHoraPai = true;

    setCalculationStep?.({
      step: "select-pai",
    });

    setPaiSelections?.({
      paiList,
    });

    setDialog?.({ open: false });
  };

  const applyKokushiMusou = () => {
    const paiList = [
      ...PaiGenerator.generateKokushiMusou13MenMachi(),
      "1m",
    ].map((pai) => ({
      index: 0,
      isFuro: false,
      isHoraPai: false,
      isDoraPai: false,
      isAkaDora: false,
      isUraDoraPai: false,
      isKanPai: false,
      pai: pai as PaiName,
    }));
    paiList[0].isHoraPai = true;

    setCalculationStep?.({
      step: "select-pai",
    });

    setPaiSelections?.({
      paiList,
    });

    setDialog?.({ open: false });
  };

  const applyTanyaoButDoubleYakuman = () => {
    setPaiSelections?.({
      paiList: [
        {
          pai: "2m",
          index: 0,
          isFuro: false,
          isHoraPai: false,
          isDoraPai: false,
          isAkaDora: false,
          isUraDoraPai: false,
          isKanPai: false,
        },
        {
          pai: "3m",
          index: 0,
          isFuro: false,
          isHoraPai: false,
          isDoraPai: false,
          isAkaDora: false,
          isUraDoraPai: false,
          isKanPai: false,
        },
        {
          pai: "4m",
          index: 0,
          isFuro: false,
          isHoraPai: false,
          isDoraPai: false,
          isAkaDora: false,
          isUraDoraPai: false,
          isKanPai: false,
        },
        {
          pai: "2m",
          index: 1,
          isFuro: false,
          isHoraPai: false,
          isDoraPai: false,
          isAkaDora: false,
          isUraDoraPai: false,
          isKanPai: false,
        },
        {
          pai: "3m",
          index: 1,
          isFuro: false,
          isHoraPai: false,
          isDoraPai: false,
          isAkaDora: false,
          isUraDoraPai: false,
          isKanPai: false,
        },
        {
          pai: "4m",
          index: 1,
          isFuro: false,
          isHoraPai: false,
          isDoraPai: false,
          isAkaDora: false,
          isUraDoraPai: false,
          isKanPai: false,
        },
        {
          pai: "2m",
          index: 2,
          isFuro: false,
          isHoraPai: false,
          isDoraPai: false,
          isAkaDora: false,
          isUraDoraPai: false,
          isKanPai: false,
        },
        {
          pai: "3m",
          index: 2,
          isFuro: false,
          isHoraPai: false,
          isDoraPai: false,
          isAkaDora: false,
          isUraDoraPai: false,
          isKanPai: false,
        },
        {
          pai: "4m",
          index: 2,
          isFuro: false,
          isHoraPai: false,
          isDoraPai: false,
          isAkaDora: false,
          isUraDoraPai: false,
          isKanPai: false,
        },

        {
          pai: "2p",
          index: 0,
          isFuro: false,
          isHoraPai: false,
          isDoraPai: false,
          isAkaDora: false,
          isUraDoraPai: false,
          isKanPai: false,
        },
        {
          pai: "2p",
          index: 1,
          isFuro: false,
          isHoraPai: false,
          isDoraPai: false,
          isAkaDora: false,
          isUraDoraPai: false,
          isKanPai: false,
        },
        {
          pai: "2p",
          index: 2,
          isFuro: false,
          isHoraPai: false,
          isDoraPai: false,
          isAkaDora: false,
          isUraDoraPai: false,
          isKanPai: false,
        },

        {
          pai: "5m",
          index: 0,
          isFuro: false,
          isHoraPai: false,
          isDoraPai: false,
          isAkaDora: false,
          isUraDoraPai: false,
          isKanPai: false,
        },
        {
          pai: "5m",
          index: 1,
          isFuro: false,
          isHoraPai: true,
          isDoraPai: false,
          isAkaDora: false,
          isUraDoraPai: false,
          isKanPai: false,
        },
      ],
    });

    setCalculationStep?.({
      step: "select-pai",
    });

    setDialog?.({ open: false });
  };

  const applySanShokuDouJun = () => {
    const paiList = [
      "1m",
      "2m",
      "3m",
      "1p",
      "2p",
      "3p",

      "1s",
      "2s",
      "3s",
      "3s",
      "3s",
      "3s",

      "4s",
      "4s",
    ].map((pai) => ({
      index: 0,
      isFuro: false,
      isHoraPai: false,
      isDoraPai: false,
      isAkaDora: false,
      isUraDoraPai: false,
      isKanPai: false,
      pai: pai as PaiName,
    }));
    paiList[0].isHoraPai = true;

    setCalculationStep?.({
      step: "select-pai",
    });

    setPaiSelections?.({
      paiList,
    });

    setDialog?.({ open: false });
  };

  const applySuKantsu = () => {
    setPaiSelections?.({
      paiList: [
        ...[option?.playStyle === 3 ? "1m" : "5m"].repeat(2).map((v, k) => ({
          pai: v as PaiName,
          index: k % 3,
          isFuro: false,
          isHoraPai: false,
          isDoraPai: false,
          isAkaDora: false,
          isUraDoraPai: false,
          isKanPai: false,
        })),
        ...[
          ...[option?.playStyle === 3 ? "1sk" : "1mk"].repeat(4),
          ...[option?.playStyle === 3 ? "9sk" : "2mk"].repeat(4),
          ...[option?.playStyle === 3 ? "3sk" : "3mk"].repeat(4),
          ...[option?.playStyle === 3 ? "3pk" : "4mk"].repeat(4),
        ].map((v, k) => ({
          pai: v as PaiName,
          index: k % 3,
          isFuro: false,
          isHoraPai: false,
          isDoraPai: false,
          isAkaDora: false,
          isUraDoraPai: false,
          isKanPai: true,
        })),
      ],
    });

    setCalculationStep?.({
      step: "select-pai",
    });

    setDialog?.({ open: false });
  };

  const applyChiiToitsu = () => {
    setPaiSelections?.({
      paiList: [
        ...(option?.playStyle === 3
          ? [
              ...["2p"].repeat(2),
              ...["3s"].repeat(2),
              ...["4s"].repeat(2),
              ...["7s"].repeat(2),
              ...["9s"].repeat(2),
              ...["1z"].repeat(2),
              ...["2z"].repeat(2),
            ]
          : [
              ...["1m"].repeat(2),
              ...["3m"].repeat(2),
              ...["4m"].repeat(2),
              ...["7s"].repeat(2),
              ...["9s"].repeat(2),
              ...["1z"].repeat(2),
              ...["2z"].repeat(2),
            ]
        ).map((v, k) => ({
          pai: v as PaiName,
          index: k % 2,
          isFuro: false,
          isHoraPai: k === 0,
          isDoraPai: false,
          isAkaDora: false,
          isUraDoraPai: false,
          isKanPai: false,
        })),
      ],
    });

    setCalculationStep?.({
      step: "select-pai",
    });

    setDialog?.({ open: false });
  };

  return (
    <div className="dialog">
      <div className="dialog-title">入力サポート</div>
      <div className="dialog-contents">
        <p>
          役の入力をサポートします。簡易的に点数を確認したい場合などにご利用ください。
        </p>

        <h2 className="font-bold mt-4 text-xl">よく出る役</h2>
        <button
          type="button"
          className="button primary-button w-full mt-2 outline-button"
          onClick={applyTanyao}
        >
          <ruby>
            断么九・平和
            <rp>(</rp>
            <rt>タンヤオ・ピンフ</rt>
            <rp>)</rp>
          </ruby>
          の計算をしてみる
        </button>
        <button
          type="button"
          disabled={option?.playStyle === 3}
          className="button primary-button w-full mt-2 outline-button"
          onClick={applySanShokuDouJun}
        >
          <ruby>
            三色同順・平和
            <rp>(</rp>
            <rt>サンショクドウジュン・ピンフ</rt>
            <rp>)</rp>
          </ruby>
          の計算をしてみる
        </button>

        <button
          type="button"
          className="button primary-button w-full mt-2 outline-button"
          onClick={applyChiiToitsu}
        >
          <ruby>
            七対子
            <rp>(</rp>
            <rt>チートイツ</rt>
            <rp>)</rp>
          </ruby>
          の計算をしてみる
        </button>

        <h2 className="font-bold mt-4 text-xl">役満 / ダブル役満</h2>
        <button
          type="button"
          className="button primary-button w-full mt-2 outline-button"
          onClick={applyKokushiMusou}
        >
          <ruby>
            国士無双十三面待ち
            <rp>(</rp>
            <rt>コクシムソウジュウサンメンマチ</rt>
            <rp>)</rp>
          </ruby>
          の計算をしてみる
        </button>
        <button
          type="button"
          className="button primary-button w-full mt-2 outline-button"
          onClick={applySuKantsu}
        >
          <ruby>
            四槓子
            <rp>(</rp>
            <rt>スーカンツ</rt>
            <rp>)</rp>
          </ruby>
          の計算をしてみる
        </button>

        <h2 className="font-bold mt-4 text-xl">その他</h2>
        <button
          type="button"
          disabled={option?.playStyle === 3}
          className="button primary-button w-full mt-2 outline-button"
          onClick={applyTanyaoButDoubleYakuman}
        >
          <ruby>
            断么九
            <rp>(</rp>
            <rt>タンヤオ</rt>
            <rp>)</rp>
          </ruby>
          （AA でおなじみの方）の計算をしてみる
        </button>
      </div>
      <div className="dialog-footer mt-2 mb-3 ml-3 mr-3">
        <button
          type="button"
          className="button primary-button outline-button w-full"
          onClick={() => setDialog?.({ open: false })}
        >
          閉じる
        </button>
      </div>
    </div>
  );
};

export default DialogInputSupport;
