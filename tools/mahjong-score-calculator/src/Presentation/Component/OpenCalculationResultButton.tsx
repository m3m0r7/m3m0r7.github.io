import React, { useContext } from 'react';
import CalculationStepContext from "../Context/CalculationStepContext";
import DialogContext from "../Context/DialogContext";

const OpenCalculationResultButton = () => {
  const [calculationStep, setCalculationStep] = useContext(CalculationStepContext)
  const [dialog, setDialog] = useContext(DialogContext)

  const openCalculationResult = () => {
    setDialog?.({
      open: true,
      openType: 'score-detail',
    })
  }

  return <button type="button" disabled={calculationStep?.step !== 'finish'} onClick={openCalculationResult} className="button calculation-result-button w-full">
    点数計算の詳細を見る
  </button>;
};

export default OpenCalculationResultButton;
