import React, { useContext, useEffect, useState } from "react";
import { Hora, PaiGroupName, PaiName, ScoreData } from "../../@types/types";
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
} from "../../Runtime/MahjongDefaultOption";
import I18n from "../../Lang/I18n";

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
            selection?.paiList?.find(
              (paiOptionInfo: PaiOptionInfo) => paiOptionInfo.isHoraPai,
            )?.pai ??
            selection?.paiList?.[0].pai ??
            "1m",
          fromTsumo: option?.hora?.fromTsumo ?? false,
          fromRon: option?.hora?.fromRon ?? false,
          fromRinshanPai: option?.hora?.fromRinshanPai ?? false,
        },
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
          .map((v) => v.pai),
        uraDoraList: selection.paiList
          .filter((v) => v.isUraDoraPai)
          .map((v) => v.pai),
      },
    );

    try {
      setScoreData?.(mahjong.score.fourPlayerStyleScore);
    } catch (e) {
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
    (scoreData?.appliedFuList?.length ?? 0) > 0 &&
    !scoreData?.appliedYakuList.some(
      (score) => score.isYakuman || score.isDoubleYakuman,
    );
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
            {(scoreData?.yaku === "FULL" ? (
              "役満"
            ) : scoreData?.yaku === "DOUBLE_FULL" ? (
              <>ダブル役満</>
            ) : (
              scoreData?.yaku
            )) ?? "-"}
          </span>
          {scoreData?.yaku !== "FULL" && scoreData?.yaku !== "DOUBLE_FULL" && (
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
        <ul className={`applied-yaku-list align-middle grid grid-cols-${(scoreData?.appliedYakuList?.length ?? 0) >= 4 ? '4' : `${scoreData?.appliedYakuList?.length ?? 4}`} gap-1`}>
          {scoreData?.appliedYakuList.slice(0, 3).map((score, key) => (
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
            <li className="applied-yaku-list--message">…</li>
          )}
          {!scoreData?.appliedYakuList && (
            <li className="col-span-4 applied-yaku-list--message">
              下記から牌を選んでください
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default MahjongScoreArea;
