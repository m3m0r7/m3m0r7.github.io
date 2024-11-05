import React, { useContext } from "react";
import { PaiGroupName } from "../../@types/types";
import { createURL } from "../Option";
import PaiSelectionContext from "../Context/PaiSelectionContext";
import DialogContext from "../Context/DialogContext";
import CalculationStepContext from "../Context/CalculationStepContext";

const DoCalculateButton = () => {
  const [dialog, setDialog] = useContext(DialogContext);
  const [calculationStep, setCalculationStep] = useContext(
    CalculationStepContext,
  );
  const [_selection] = useContext(PaiSelectionContext);
  const selection = _selection ?? {
    paiList: [],
    needsRinshanPai: 0,
    rinshanPaiList: [],
  };

  const startScoreCalculation = () => {
    setDialog?.({
      open: true,
      openType: "score-calculation",
      value: selection,
    });
  };

  const resetAll = () => {
    setDialog?.({
      open: true,
      openType: "reset-calculation",
    });
  };

  if (calculationStep?.step !== "select-pai") {
    return (
      <button
        type="button"
        disabled={
          selection.paiList.length + selection.rinshanPaiList.length <
          14 + selection.needsRinshanPai
        }
        className="button do-calculate-button outline-button w-full"
        onClick={resetAll}
      >
        リセットする
      </button>
    );
  }

  return (
    <button
      type="button"
      disabled={
        selection.paiList.length + selection.rinshanPaiList.length <
        14 + selection.needsRinshanPai
      }
      className="button do-calculate-button button--with-reflecting-animation w-full"
      onClick={startScoreCalculation}
    >
      点数計算を開始する
    </button>
  );
};

export default DoCalculateButton;
