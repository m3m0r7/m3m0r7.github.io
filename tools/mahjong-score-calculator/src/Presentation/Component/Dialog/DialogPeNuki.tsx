import React, { useContext } from "react";
import DialogContext, { DialogType } from "../../Context/DialogContext";
import PaiSelectionContext from "../../Context/PaiSelectionContext";
import OptionContext from "../../Context/OptionContext";
import { MahjongDefaultOption } from "../../../Runtime/MahjongDefaultOption";
import ScoreDataContext from "../../Context/ScoreDataContext";
import CalculationStepContext from "../../Context/CalculationStepContext";
import SystemOptionContext, {
  SystemDefaultOption,
} from "../../Context/SystemOptionContext";

const name: DialogType["openType"] = "pe-nuki";

const DialogPeNuki = () => {
  const [calculationStep, setCalculationStep] = useContext(
    CalculationStepContext,
  );
  const [dialog, setDialog] = useContext(DialogContext);
  const [paiSelections, setPaiSelections] = useContext(PaiSelectionContext);
  const [option, setOption] = useContext(OptionContext);
  const [systemOption, setSystemOption] = useContext(SystemOptionContext);
  const [scoreData, setScoreData] = useContext(ScoreDataContext);

  if (!dialog || !setDialog || !dialog.open || name !== dialog.openType) {
    return null;
  }

  const doPeNuki = () => {
    setPaiSelections?.({
      paiList: [],
      peNukiList: [...(paiSelections?.peNukiList ?? []), dialog.index],
    });
    setOption?.({
      ...option,
      peNukiList: [...(option?.peNukiList ?? []), "4z"],
    });
    setScoreData?.(null);
    setCalculationStep?.({
      step: "select-pai",
    });
    setSystemOption?.({
      ...SystemDefaultOption,
    });
    setDialog?.({ open: false });
  };

  return (
    <div className="dialog">
      <div className="dialog-title">北抜きの確認</div>
      <div className="dialog-message">
        北抜きをしますか？北抜きをするとドラが増えます。
      </div>
      <div className="dialog-footer mt-2 mb-3 grid grid-cols-2 gap-2 ml-3 mr-3">
        <button
          type="button"
          className="button primary-button outline-button"
          onClick={() => setDialog?.({ open: false })}
        >
          キャンセルする
        </button>
        <button
          type="button"
          className="button primary-button"
          onClick={doPeNuki}
        >
          北抜きする
        </button>
      </div>
    </div>
  );
};

export default DialogPeNuki;
