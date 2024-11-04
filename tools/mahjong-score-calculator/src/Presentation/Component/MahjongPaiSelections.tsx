import React, { useContext, useEffect, useState } from "react";
import { createURL } from "../Option";
import PaiSelectionContext from "../Context/PaiSelectionContext";
import CalculationStepContext from "../Context/CalculationStepContext";
import OptionContext from "../Context/OptionContext";

const MahjongPaiSelections = () => {
  const [_selections, setSelections] = useContext(PaiSelectionContext);
  const [option] = useContext(OptionContext);
  const [calculationStep, setCalculationStep] = useContext(
    CalculationStepContext,
  );
  const [copied, setCopied] = useState(false);

  const selection = _selections ?? {
    paiList: [],
  };

  const removePai = (index: number) => {
    setCalculationStep?.({
      step: "select-pai",
    });
    setSelections?.({
      paiList: selection.paiList.filter((selection, k) => k !== index),
    });
  };

  const selectHora = (index: number) => {
    const pai = selection.paiList[index];

    setSelections?.({
      ...selection,
      paiList: selection.paiList.map((v, k) => ({
        ...v,
        isHoraPai: k === index ? !pai.isHoraPai : false,
      })),
    });
  };

  const selectFuro = (index: number) => {
    setSelections?.({
      ...selection,
      paiList: selection.paiList.map((v, k) => ({
        ...v,
        isFuro: k === index ? !v.isFuro : v.isFuro,
      })),
    });
  };

  const selectDora = (index: number) => {
    const dora = selection.paiList[index];

    if (calculationStep?.step === "select-dora") {
      dora.isDoraPai = !dora.isDoraPai;
    } else {
      dora.isUraDoraPai = !dora.isUraDoraPai;
    }

    // NOTE: Do be a dora when same pai
    setSelections?.({
      ...selection,
      paiList: selection.paiList.map((pai) => {
        if (pai.pai !== dora.pai) {
          return pai;
        }

        if (calculationStep?.step === "select-dora") {
          pai.isDoraPai = dora.isDoraPai;
        } else {
          pai.isUraDoraPai = dora.isUraDoraPai;
        }
        return pai;
      }),
    });
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
    <div>
      <ul className="grid grid-cols-8 gap-1 pai-selections">
        {selection.paiList.map((v, k) => (
          <li
            key={k}
            onClick={() =>
              calculationStep?.step === "select-dora" ||
              calculationStep?.step === "select-ura-dora"
                ? selectDora(k)
                : calculationStep?.step === "select-hora-pai"
                  ? selectHora(k)
                  : calculationStep?.step === "select-furo-pai"
                    ? selectFuro(k)
                    : removePai(k)
            }
            className={`pai-selection-text flex w-full items-center justify-center  ${selection.paiList[k].isDoraPai ? "pai-selections--pai--dora" : ""} ${selection.paiList[k].isUraDoraPai ? "pai-selections--pai--ura-dora" : ""} ${selection.paiList[k].isAkaDora ? "pai-selections--pai--aka-dora" : ""} ${selection.paiList[k].isHoraPai ? "pai-selections--pai--hora" : ""} ${selection.paiList[k].isFuro ? "pai-selections--pai--furo" : ""}`}
          >
            <div
              className="pai-selections--pai"
              style={{
                backgroundImage: `url(${createURL(`images/pai/${v.pai}${v.isAkaDora ? "a" : ""}.png`)})`,
              }}
            ></div>
          </li>
        ))}
        {Array.from({ length: 14 - selection.paiList.length }, (_, k) => k).map(
          (k) => (
            <li
              key={k}
              className="pai-selection-text flex w-full items-center justify-center"
            >
              <div>
                <div className="text-center">牌</div>
              </div>
            </li>
          ),
        )}
        <li className="col-span-2 place-self-center">
          <div className="share-button" onClick={shareButton}>
            {copied ? "✅️ コピー" : "📋️ URLを共有"}
          </div>
        </li>
      </ul>
    </div>
  );
};

export default MahjongPaiSelections;
