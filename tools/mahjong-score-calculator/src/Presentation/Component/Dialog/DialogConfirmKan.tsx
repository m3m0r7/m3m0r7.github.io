import React, { useContext } from "react";
import DialogContext, { DialogType } from "../../Context/DialogContext";
import PaiSelectionContext from "../../Context/PaiSelectionContext";
import OptionContext from "../../Context/OptionContext";
import ScoreDataContext from "../../Context/ScoreDataContext";
import CalculationStepContext from "../../Context/CalculationStepContext";
import { PaiName } from "../../../@types/types";

const name: DialogType["openType"] = "confirm-kan";

const DialogConfirmKan = () => {
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

  const doKan = () => {
    setPaiSelections?.({
      ...(paiSelections ?? {}),
      paiList:
        paiSelections?.paiList.map((v) =>
          v.pai === dialog.value
            ? {
                ...v,
                pai: `${v.pai}k` as PaiName,
                isKanPai: true,
              }
            : v,
        ) ?? [],
    });

    setDialog?.({
      open: false,
    });
  };

  return (
    <div className="dialog">
      <div className="dialog-title">カンの確認</div>
      <div className="dialog-message">
        同じ牌が 4 つ選ばれました。カンしますか？
        <br />
        カンをすると嶺上牌を選択できるようになります。
      </div>
      <div className="dialog-footer mt-2 mb-3 grid grid-cols-2 gap-2 ml-3 mr-3">
        <button
          type="button"
          className="button primary-button outline-button"
          onClick={() => setDialog?.({ open: false })}
        >
          キャンセルする
        </button>
        <button type="button" className="button primary-button" onClick={doKan}>
          カンする
        </button>
      </div>
    </div>
  );
};

export default DialogConfirmKan;
