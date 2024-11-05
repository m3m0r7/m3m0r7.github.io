import React, { useContext, useState } from "react";
import PaiSelectionContext from "../Context/PaiSelectionContext";
import CalculationStepContext from "../Context/CalculationStepContext";
import OptionContext from "../Context/OptionContext";

const ShareButton = () => {
  const [_selections, setSelections] = useContext(PaiSelectionContext);
  const [calculationStep, setCalculationStep] = useContext(
    CalculationStepContext,
  );
  const [option] = useContext(OptionContext);
  const [copied, setCopied] = useState(false);

  const selection = _selections ?? {
    paiList: [],
  };

  const createFullURL = () => {
    const defaultUrl = new URL(location.href);
    defaultUrl.searchParams.set(
      "paiList",
      selection.paiList
        .map((pai) => {
          let text: string = pai.pai;
          if (pai.isDoraPai) {
            text += "d";
          }
          if (pai.isHoraPai) {
            text += "h";
          }
          if (pai.isUraDoraPai) {
            text += "u";
          }
          if (pai.isFuro) {
            text += "f";
          }
          if (pai.isAkaDora) {
            text += "a";
          }
          return text;
        })
        .join(""),
    );

    if (calculationStep?.step) {
      defaultUrl.searchParams.set("calculationStep", calculationStep.step);
    }
    defaultUrl.searchParams.set("option", JSON.stringify(option));
    return defaultUrl.toString();
  };

  const shareButton = () => {
    navigator.clipboard.writeText(createFullURL());
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1500);
  };


  return (
    <div className="share-button" onClick={shareButton}>
      {copied ? "✅️ コピー" : "📋️ URL"}
    </div>
  )
}

export default ShareButton
