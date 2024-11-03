import React, { useContext, useEffect, useState } from 'react';
import { PaiGroupName, PaiName, ScoreData } from "../../@types/types";
import { createURL } from "../Option";
import CalculationStepContext from "../Context/CalculationStepContext";
import { Mahjong } from "../../Runtime/Mahjong";
import PaiSelectionContext from "../Context/PaiSelectionContext";
import ScoreDataContext from "../Context/ScoreDataContext";
import OptionContext from "../Context/OptionContext";
import { MahjongDefaultAdditionalSpecialYaku, MahjongDefaultLocalRules } from "../../Runtime/MahjongDefaultOption";

const MahjongScoreArea = () => {
  const [scoreData, setScoreData] = useContext(ScoreDataContext)
  const [calculationStep, setCalculationStep] = useContext(CalculationStepContext)
  const [option] = useContext(OptionContext)

  const [ _selection ] = useContext(PaiSelectionContext);
  const selection = _selection ?? {
    paiList: [],
  }

  useEffect(() => {
    if (calculationStep?.step !== 'finish') {
      return
    }

    const mahjong = new Mahjong(
      selection.paiList.map((v) => `${v.pai}${v.isAkaDora ? 'a' : ''}${v.isFuro ? 'f' : ''}` as PaiName),
      {
        ...option,
        localRules: {
          ...MahjongDefaultLocalRules,
          ...option?.localRules,
        },
        additionalSpecialYaku: {
          ...MahjongDefaultAdditionalSpecialYaku,
          ...(option?.additionalSpecialYaku ?? [])
        },
        doraList: selection.doraList?.map((v) => v.pai) ?? [],
        uraDoraList: selection.uraDoraList?.map((v) => v.pai) ?? [],
      }
    )

    try {
      setScoreData?.(mahjong.score.fourPlayerStyleScore)
    } catch (e) {
      setCalculationStep?.({
        step: 'error',
        message: '役がありません。もう一度ご確認ください。',
      })
    }

  }, [calculationStep?.step])

  if (calculationStep?.step === 'error') {
    return <div className="score-area flex items-center justify-center" style={ { height: '79px' } }>
      <div>{calculationStep?.message}</div>
    </div>
  }

  return <div className="score-area flex items-center">
    <div className="text-center basis-1/4">
      <span className="score-area--value">{scoreData?.fu ?? '-'}</span>
      <h2>
        <ruby>符
          <rp>(</rp>
          <rt>ふ</rt>
          <rp>)</rp>
        </ruby>
      </h2>
    </div>
    <div className="text-center basis-1/4">
      <span className="score-area--value">{scoreData?.yaku ?? '-'}</span>
      <h2><ruby>翻
        <rp>(</rp>
        <rt>はん</rt>
        <rp>)</rp>
      </ruby></h2>
    </div>
    {
      scoreData?.score.parent && scoreData?.score.child && <div className="text-center basis-2/4">
        <span className="score-area--value">{scoreData?.score.parent}/{scoreData?.score.child}</span>
        <h2>親/子</h2>
      </div>
    }
    {
      ! scoreData?.score.parent && scoreData?.score.child && <div className="text-center basis-2/4">
        <span className="score-area--value">{scoreData?.score.base}/{scoreData?.score.child}</span>
        <h2>点/子</h2>
      </div>
    }
    {
      ! scoreData?.score.parent && ! scoreData?.score.child && <div className="text-center basis-2/4">
        <span className="score-area--value">{scoreData?.score.base ?? '-'}</span>
        <h2>点</h2>
      </div>
    }

  </div>;
};

export default MahjongScoreArea;
