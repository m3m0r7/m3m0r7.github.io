import React, { useContext } from "react";
import CalculationStepContext from "../Context/CalculationStepContext";
import OptionContext from "../Context/OptionContext";
import PaiSelectionContext from "../Context/PaiSelectionContext";

const StepMessageButton = () => {
  const [calculationStep, setCalculationStep] = useContext(
    CalculationStepContext,
  );
  const [option, setOption] = useContext(OptionContext);
  const [_selection] = useContext(PaiSelectionContext);

  const selection = _selection ?? {
    paiList: [],
  };

  const doSelectUraDora = () => {
    if (calculationStep?.step === "select-dora") {
      if (
        option?.additionalSpecialYaku?.withRiichi ||
        option?.additionalSpecialYaku?.withOpenRiichi ||
        option?.additionalSpecialYaku?.withDoubleRiichi
      ) {
        setCalculationStep?.({
          step: "select-ura-dora",
        });
      } else {
        setCalculationStep?.({
          step: "select-hora-pai",
        });
      }
    }
    if (calculationStep?.step === "select-ura-dora") {
      setCalculationStep?.({
        step: "select-hora-pai",
      });
    }
    if (calculationStep?.step === "select-hora-pai") {
      setCalculationStep?.({
        step: "finish",
      });
      setOption?.({
        ...option,
        doraList: selection?.paiList
          ?.filter((v) => v.isDoraPai)
          .map((v) => v.pai),
        uraDoraList: selection?.paiList
          ?.filter((v) => v.isUraDoraPai)
          .map((v) => v.pai),
      });
    }
  };
  if (calculationStep?.step === "select-hora-pai") {
    return (
      <button
        type="button"
        className="button secondary-button w-full"
        onClick={doSelectUraDora}
      >
        和了（あがり）牌を選んで点数の結果を確認
      </button>
    );
  }

  return (
    <button
      type="button"
      className="button secondary-button w-full"
      onClick={doSelectUraDora}
    >
      {calculationStep?.step === "select-dora" ? "ドラ" : "裏ドラ"}
      を選びおわったら、ここをクリックして次へ
    </button>
  );
};

export default StepMessageButton;
