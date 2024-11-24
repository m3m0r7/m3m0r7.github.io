import React, { useContext, useEffect, useState } from "react";
import {
  CalculatedScore,
  Hora,
  PaiGroupName,
  PaiName,
  ScoreData,
} from "../../@types/types";
import { createURL } from "../Option";
import CalculationStepContext from "../Context/CalculationStepContext";
import { Mahjong } from "../../Runtime/Mahjong";
import PaiSelectionContext, {
  PaiOptionInfo,
} from "../Context/PaiSelectionContext";
import ScoreDataContext from "../Context/ScoreDataContext";
import OptionContext from "../Context/OptionContext";
import {
  MahjongDefaultAdditionalSpecialYaku,
  MahjongDefaultLocalRules,
  MahjongDefaultOption,
} from "../../Runtime/MahjongDefaultOption";
import I18n from "../../Lang/I18n";
import { convertToNormalPai } from "../../Utilities/Converter";

const colorGradientByHan = {
  1: "#000080",
  2: "#090077",
  3: "#12006E",
  4: "#1B0065",
  5: "#24005C",
  6: "#2D0053",
  7: "#36004A",
  8: "#3F0041",
  9: "#480038",
  10: "#51002F",
  11: "#5A0026",
  12: "#63001D",
  13: "#6C0014",
  FULL: "#75000B",
  DOUBLE_FULL: "#7E0002",
};

const MahjongScoreArea = () => {
  const [scoreData, setScoreData] = useContext(ScoreDataContext);
  const [calculationStep, setCalculationStep] = useContext(
    CalculationStepContext,
  );
  const [option] = useContext(OptionContext);

  const [_selection] = useContext(PaiSelectionContext);
  const selection = _selection ?? {
    paiList: [],
  };

  useEffect(() => {
    if (calculationStep?.step !== "finish") {
      return;
    }

    const mahjong = new Mahjong(
      selection.paiList.map(
        (v) =>
          `${v.pai}${v.isAkaDora ? "a" : ""}${v.isFuro ? "f" : ""}` as PaiName,
      ),
      {
        ...option,
        hora: {
          ...(option?.hora ?? {}),
          pai:
            convertToNormalPai(
              selection?.paiList?.find(
                (paiOptionInfo: PaiOptionInfo) => paiOptionInfo.isHoraPai,
              )?.pai ?? selection?.paiList?.[0].pai,
            ) ?? "1m",
          fromTsumo: option?.hora?.fromTsumo ?? false,
          fromRon: option?.hora?.fromRon ?? false,
          fromRinshanPai: option?.hora?.fromRinshanPai ?? false,
        },
        fuList: MahjongDefaultOption.fuList,
        yakuList: MahjongDefaultOption.yakuList,
        localRules: {
          ...MahjongDefaultLocalRules,
          ...option?.localRules,
        },
        additionalSpecialYaku: {
          ...MahjongDefaultAdditionalSpecialYaku,
          ...(option?.additionalSpecialYaku ?? []),
        },
        doraList: selection.paiList
          .filter((v) => v.isDoraPai)
          .map((v) => convertToNormalPai(v.pai) ?? "1m"),
        uraDoraList: selection.paiList
          .filter((v) => v.isUraDoraPai)
          .map((v) => convertToNormalPai(v.pai) ?? "1m"),
      },
    );

    try {
      setScoreData?.(mahjong.calculator.value);
    } catch (e) {
      console.log(e);
      setCalculationStep?.({
        step: "error",
        message: "役がないか、フォーマットが正しくありません",
      });
    }
  }, [calculationStep?.step]);

  if (calculationStep?.step === "error") {
    return (
      <div className="score-area">
        <div className="score-area--data flex items-center justify-center">
          <div>{calculationStep?.message}</div>
        </div>
        <hr className="mt-2 mb-2" />
        <div>
          <ul className="applied-yaku-list align-middle grid grid-cols-4 gap-1">
            <li className="col-span-4 applied-yaku-list--message">
              もう一度、下記から牌を選んでください
            </li>
          </ul>
        </div>
      </div>
    );
  }

  const showFuBox =
    !scoreData || (scoreData?.fu !== null && scoreData?.yakuType === "NORMAL");

  const summarizedAppliedYakuList: CalculatedScore[] | undefined =
    scoreData?.appliedYakuList
      .filter((v) => !v.isFu)
      .sort((a, b) => {
        if (a.isFu || b.isFu) {
          return 0;
        }
        if (
          a.isYakuman ||
          b.isYakuman ||
          a.isDoubleYakuman ||
          b.isDoubleYakuman
        ) {
          return 0;
        }
        return b.score - a.score;
      });

  return (
    <div className="score-area">
      <div className="score-area--data flex items-center">
        {showFuBox && (
          <div className="text-center basis-1/4">
            <span className="score-area--value">{scoreData?.fu ?? "-"}</span>
            <h2>
              <ruby>
                符<rp>(</rp>
                <rt>ふ</rt>
                <rp>)</rp>
              </ruby>
            </h2>
          </div>
        )}
        <div
          className={
            showFuBox ? "text-center basis-1/4" : "text-center basis-2/4"
          }
        >
          <span className="score-area--value">
            {scoreData
              ? scoreData?.yakuType === "NORMAL"
                ? scoreData?.yaku
                : `${option?.jikaze === "1z" ? "親" : ""}${I18n.ja.pronunciation.yakuType[scoreData?.yakuType ?? "NORMAL"]}`
              : "-"}
          </span>
          {(!scoreData || scoreData?.yakuType === "NORMAL") && (
            <h2>
              <ruby>
                翻<rp>(</rp>
                <rt>はん</rt>
                <rp>)</rp>
              </ruby>
            </h2>
          )}
        </div>
        {scoreData?.score.parent && scoreData?.score.child && (
          <div className="text-center basis-2/4">
            <span className="score-area--value">
              {scoreData?.score.parent}/{scoreData?.score.child}
            </span>
            <h2>親/子</h2>
          </div>
        )}
        {!scoreData?.score.parent && scoreData?.score.child && (
          <div className="text-center basis-2/4">
            <span className="score-area--value">{scoreData?.score.child}</span>
            <h2>オール</h2>
          </div>
        )}
        {!scoreData?.score.parent && !scoreData?.score.child && (
          <div className="text-center basis-2/4">
            <span className="score-area--value">
              {scoreData?.score.base ?? "-"}
            </span>
            <h2>点</h2>
          </div>
        )}
      </div>
      <hr className="mt-2 mb-2" />
      <div>
        <ul
          className={`applied-yaku-list align-middle grid grid-cols-${(scoreData?.appliedYakuList?.length ?? 0) >= 4 ? "4" : `${scoreData?.appliedYakuList?.length ?? 4}`} gap-1`}
        >
          {summarizedAppliedYakuList?.slice(0, 3).map((score, key) => (
            <li
              key={key}
              className={
                score.isYakuman || score.isDoubleYakuman ? "col-span-4" : ""
              }
              style={{
                backgroundColor: !score.isFu
                  ? colorGradientByHan[
                      (score.isYakuman
                        ? "FULL"
                        : score.isDoubleYakuman
                          ? "DOUBLE_FULL"
                          : score.score) as keyof typeof colorGradientByHan
                    ]
                  : undefined,
              }}
            >
              {I18n.ja.pronunciation.yaku[
                score.name as keyof (typeof I18n)["ja"]["pronunciation"]["yaku"]
              ] ? (
                <ruby>
                  {score.name}
                  <rp>(</rp>
                  <rt>
                    {
                      I18n.ja.pronunciation.yaku[
                        score.name as keyof (typeof I18n)["ja"]["pronunciation"]["yaku"]
                      ]
                    }
                  </rt>
                  <rp>)</rp>
                </ruby>
              ) : (
                score.name
              )}
            </li>
          ))}
          {(scoreData?.appliedYakuList?.length ?? 0) > 3 && (
            <li className="applied-yaku-list--message">
              他
              {Number(scoreData?.yaku) -
                Number(
                  summarizedAppliedYakuList
                    ?.slice(0, 3)
                    .map(
                      (v) =>
                        !v.isFu &&
                        !v.isYakuman &&
                        !v.isDoubleYakuman &&
                        v.score,
                    )
                    .sum(),
                )}
              翻
            </li>
          )}
          {!scoreData?.appliedYakuList && (
            <li className="col-span-4 applied-yaku-list--message">
              ここに成立した役の一部が表示されます
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default MahjongScoreArea;
