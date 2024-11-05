import React, { useContext, useEffect } from "react";
import { createURL } from "../Option";
import PaiSelectionContext, {
  PaiOptionInfo,
} from "../Context/PaiSelectionContext";
import CalculationStepContext from "../Context/CalculationStepContext";
import ScoreDataContext from "../Context/ScoreDataContext";
import { PaiName } from "../../@types/types";
import ShareButton from "./ShareButton";
import SystemOptionContext from "../Context/SystemOptionContext";

const MahjongPaiSelections = () => {
  const [_selections, setSelections] = useContext(PaiSelectionContext);
  const [scoreData] = useContext(ScoreDataContext);
  const [systemOption] = useContext(SystemOptionContext);
  const [calculationStep, setCalculationStep] = useContext(
    CalculationStepContext,
  );

  const selection = _selections ?? {
    paiList: [],
    needsRinshanPai: 0,
    rinshanPaiList: [],
  };

  const removePai = (index: number) => {
    setCalculationStep?.({
      step: "select-pai",
    });
    setSelections?.({
      ...selection,
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
      needsRinshanPai: 0,
      rinshanPaiList: [],
    });
  };

  useEffect(() => {
    if (calculationStep?.step !== "finish") {
      return;
    }

    if (scoreData === null) {
      return;
    }

    if (!systemOption?.ripai) {
      return;
    }

    const orderedPositions: PaiName[] = [];

    scoreData?.paiPatterns.forEach((paiPatterns) => {
      paiPatterns.pattern.forEach((paiInfo) => {
        orderedPositions.push(paiInfo.pai);
      });
    });

    const pickedPosition: number[] = [];
    setSelections?.({
      ...selection,
      paiList: orderedPositions.map(
        (paiName, k) =>
          selection.paiList.find((pai, index) => {
            const result =
              pai.pai === paiName && !pickedPosition.includes(index);
            if (result) {
              pickedPosition.push(index);
            }
            return result;
          }) as PaiOptionInfo,
      ),
      needsRinshanPai: 0,
      rinshanPaiList: [],
    });
  }, [scoreData, systemOption?.ripai, calculationStep?.step]);

  return (
    <div>
      <ul className="grid grid-cols-10 gap-1 pai-selections">
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

        {selection.rinshanPaiList.map((v, k) => (
          <li
            onClick={() =>
              calculationStep?.step === "select-dora" ||
              calculationStep?.step === "select-ura-dora"
                ? selectDora(k)
                : removePai(k)
            }
          >
            <div
              className="pai-selections--pai"
              style={{
                backgroundImage: `url(${createURL(`images/pai/${v.pai}${v.isAkaDora ? "a" : ""}.png`)})`,
              }}
            ></div>
          </li>
        ))}
        {Array.from(
          { length: 14 + 4 - selection.paiList.length },
          (_, k) => k,
        ).map((k) => (
          <li
            key={k}
            className="pai-selection-text flex w-full items-center justify-center"
          >
            <div>
              <div className="text-center">
                {selection.paiList.length + k >= 14 ? (
                  <>
                    嶺<br />上<br />牌
                  </>
                ) : (
                  "牌"
                )}
              </div>
            </div>
          </li>
        ))}
        <li className="col-span-2 place-self-center">
          <ShareButton />
        </li>
      </ul>
    </div>
  );
};

export default MahjongPaiSelections;
