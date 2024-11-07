import React, { useContext, useEffect } from "react";
import { createURL } from "../Option";
import PaiSelectionContext, {
  PaiOptionInfo,
} from "../Context/PaiSelectionContext";
import CalculationStepContext from "../Context/CalculationStepContext";
import ScoreDataContext from "../Context/ScoreDataContext";
import { PaiInfo, PaiName } from "../../@types/types";
import ShareButton from "./ShareButton";
import SystemOptionContext from "../Context/SystemOptionContext";
import { PaiPatternExtractor } from "../../Runtime/Extractor/Extractor";
import OptionContext from "../Context/OptionContext";
import {
  convertPaiOptionInfoToPaiName,
  convertToNormalPai,
} from "../../Utilities/Converter";

const MahjongPaiSelections = () => {
  const [_selections, setSelections] = useContext(PaiSelectionContext);
  const [scoreData] = useContext(ScoreDataContext);
  const [systemOption] = useContext(SystemOptionContext);
  const [option] = useContext(OptionContext);
  const [calculationStep, setCalculationStep] = useContext(
    CalculationStepContext,
  );

  const selection = _selections ?? {
    paiList: [],
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

  const removeKanPai = (paiName: PaiName) => {
    setCalculationStep?.({
      step: "select-pai",
    });

    setSelections?.({
      ...selection,
      paiList: selection.paiList.map((paiOptionInfo, k) => {
        if (
          convertToNormalPai(paiOptionInfo.pai) === convertToNormalPai(paiName)
        ) {
          return {
            ...paiOptionInfo,
            pai: convertToNormalPai(paiName) ?? "1m",
            isKanPai: false,
          };
        }

        return paiOptionInfo;
      }),
    });
  };

  const selectDoraKan = (paiName: PaiName) => {
    setSelections?.({
      ...selection,
      paiList: selection.paiList.map((paiOptionInfo, k) => {
        const isDoraPai =
          calculationStep?.step === "select-dora"
            ? !paiOptionInfo.isDoraPai
            : paiOptionInfo.isDoraPai;
        const isUraDoraPai =
          calculationStep?.step === "select-ura-dora"
            ? !paiOptionInfo.isUraDoraPai
            : paiOptionInfo.isUraDoraPai;

        if (
          convertToNormalPai(paiOptionInfo.pai) === convertToNormalPai(paiName)
        ) {
          return {
            ...paiOptionInfo,
            pai: convertPaiOptionInfoToPaiName({
              ...paiOptionInfo,
              isDoraPai,
              isUraDoraPai,
            }),
            isDoraPai,
            isUraDoraPai,
          };
        }

        return paiOptionInfo;
      }),
    });
  };

  const selectFuroKan = (paiName: PaiName) => {
    setSelections?.({
      ...selection,
      paiList: selection.paiList.map((paiOptionInfo, k) => {
        const isFuro = !paiOptionInfo.isFuro;

        if (
          convertToNormalPai(paiOptionInfo.pai) === convertToNormalPai(paiName)
        ) {
          return {
            ...paiOptionInfo,
            pai: convertPaiOptionInfoToPaiName({
              ...paiOptionInfo,
              isFuro,
            }),
            isFuro,
          };
        }

        return paiOptionInfo;
      }),
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

    let foundHoraPai = false;
    const pickedPositions: number[] = [];

    setSelections?.({
      ...selection,
      paiList:
        scoreData?.paiPatterns.reduce<PaiOptionInfo[]>((carry, item) => {
          return [
            ...carry,
            ...item.pattern.map<PaiOptionInfo>((v) => {
              const actualPai = selection.paiList.find((paiOptionInfo, i) => {
                const result =
                  convertToNormalPai(v.pai) ===
                    convertToNormalPai(paiOptionInfo.pai) &&
                  !pickedPositions.includes(i);
                if (result) {
                  pickedPositions.push(i);
                }
                return result;
              });

              const paiOptionInfo = {
                pai: v.pai,
                index: actualPai?.index ?? 0,
                isFuro: actualPai?.isFuro ?? false,
                isAkaDora: actualPai?.isAkaDora ?? false,
                isHoraPai: actualPai?.isHoraPai ?? false,
                isDoraPai:
                  option?.doraList?.includes(
                    convertToNormalPai(v.pai) ?? "1m",
                  ) ?? false,
                isUraDoraPai:
                  option?.uraDoraList?.includes(
                    convertToNormalPai(v.pai) ?? "1m",
                  ) ?? false,
                isKanPai: actualPai?.isKanPai ?? false,
              };

              return {
                ...paiOptionInfo,
                pai: convertPaiOptionInfoToPaiName(paiOptionInfo),
              };
            }),
          ];
        }, []) ?? [],
    });
  }, [scoreData, systemOption?.ripai, calculationStep?.step]);

  const sortedKoutsu = PaiPatternExtractor.sortByPaiName(
    selection.paiList.filter((v) => v.isKanPai).map((v) => v.pai),
    false,
  );

  return (
    <div>
      <ul className="grid grid-cols-10 gap-1 pai-selections">
        {selection.paiList
          .filter((v) => !v.isKanPai)
          .map((v, k) => {
            const [number, group, option] = PaiPatternExtractor.extractPaiPair(
              v.pai,
            );
            return (
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
                className={`pai-selection-text flex w-full items-center justify-center ${v.isDoraPai ? "pai-selections--pai--dora" : ""} ${v.isUraDoraPai ? "pai-selections--pai--ura-dora" : ""} ${v.isAkaDora ? "pai-selections--pai--aka-dora" : ""} ${v.isHoraPai ? "pai-selections--pai--hora" : ""} ${v.isFuro ? "pai-selections--pai--furo" : ""}`}
              >
                <div
                  className="pai-selections--pai"
                  style={{
                    backgroundImage: `url(${createURL(`images/pai/${number}${group}${v.isAkaDora ? "a" : ""}.png`)})`,
                  }}
                ></div>
              </li>
            );
          })}

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

        {sortedKoutsu.map((pai, k) => {
          const [number, group, option] =
            PaiPatternExtractor.extractPaiPair(pai);
          return (
            <li
              className={`${option.isDora ? "pai-selections--pai--dora" : ""} ${option.isUraDora ? "pai-selections--pai--ura-dora" : ""} ${option.isAkaDora ? "pai-selections--pai--aka-dora" : ""} ${option.fromFuro && [1, 5, 9, 13].includes(k) ? "pai-selections--pai--furo" : ""}`}
              onClick={() =>
                calculationStep?.step === "select-dora" ||
                calculationStep?.step === "select-ura-dora"
                  ? selectDoraKan(pai)
                  : calculationStep?.step === "select-furo-pai"
                    ? selectFuroKan(pai)
                    : removeKanPai(pai)
              }
            >
              <div
                className={`pai-selections--pai ${[0, 3, 4, 7, 8, 11, 12, 15].includes(k) && !option.fromFuro ? "pai-selections--pai-ura" : ""}`}
                style={{
                  ...([0, 3, 4, 7, 8, 11, 12, 15].includes(k) &&
                  !option.fromFuro
                    ? {}
                    : {
                        backgroundImage: `url(${createURL(`images/pai/${number}${group}${option.isAkaDora ? "a" : ""}.png`)})`,
                      }),
                }}
              ></div>
            </li>
          );
        })}
        <li className="col-span-2 place-self-center">
          <ShareButton />
        </li>
      </ul>
    </div>
  );
};

export default MahjongPaiSelections;
