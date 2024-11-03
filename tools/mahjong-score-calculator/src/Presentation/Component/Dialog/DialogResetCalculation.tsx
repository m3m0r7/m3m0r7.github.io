import React, { useContext } from 'react';
import DialogContext, { DialogType } from "../../Context/DialogContext";
import PaiSelectionContext from "../../Context/PaiSelectionContext";
import OptionContext from "../../Context/OptionContext";
import { MahjongDefaultOption } from "../../../Runtime/MahjongDefaultOption";
import ScoreDataContext from "../../Context/ScoreDataContext";
import CalculationStepContext from "../../Context/CalculationStepContext";

const name: DialogType['openType'] = 'reset-calculation';

const DialogResetCalculation = () => {
  const [calculationStep, setCalculationStep] = useContext(CalculationStepContext)
  const [ dialog, setDialog ] = useContext(DialogContext)
  const [ paiSelections, setPaiSelections ] = useContext(PaiSelectionContext)
  const [ option, setOption ] = useContext(OptionContext)
  const [ scoreData, setScoreData ] = useContext(ScoreDataContext)


  if (!dialog || !setDialog || !dialog.open || name !== dialog.openType) {
    return null
  }

  const resetAll = () => {
    setPaiSelections?.({
      paiList: [],
    })
    setOption?.(MahjongDefaultOption)
    setScoreData?.(null)
    setCalculationStep?.({
      step: 'select-pai',
    })
    setDialog?.({ open: false })
  }

  return <div className="dialog">
    <div className="dialog-title">
      リセットの確認
    </div>
    <div className="dialog-message">
      点数計算の情報をリセットしますか？リセットするともう一度はじめから入力し直す必要があります。
    </div>
    <div className="dialog-footer mt-2 mb-3 grid grid-cols-2 gap-2 ml-3 mr-3">
      <button type="button" className="button primary-button outline-button"
              onClick={() => setDialog?.({ open: false })}>
        キャンセルする
      </button>
      <button type="button" className="button primary-button" onClick={resetAll}>
        リセットする
      </button>
    </div>
  </div>
}

export default DialogResetCalculation
