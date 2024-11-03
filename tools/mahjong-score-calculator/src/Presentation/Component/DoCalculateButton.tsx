import React, { useContext } from 'react';
import { PaiGroupName } from "../../@types/types";
import { createURL } from "../Option";
import PaiSelectionContext from "../Context/PaiSelectionContext";
import DialogContext from "../Context/DialogContext";

const DoCalculateButton = () => {
  const [dialog, setDialog] = useContext(DialogContext)
  const [ _selection ] = useContext(PaiSelectionContext);
  const selection = _selection ?? {
    paiList: [],
  }

  const startScoreCalculation = () => {
    setDialog?.({
      open: true,
      openType: 'score-calculation',
      value: selection
    })
  }

  return <button type="button" disabled={selection.paiList.length < 14} className="button do-calculate-button w-full" onClick={startScoreCalculation}>
    点数計算を開始する
  </button>;
};

export default DoCalculateButton;
