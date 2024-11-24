import React, { useContext, useEffect, useState } from "react";
import { PaiPatternExtractor } from "../Runtime/Extractor/Extractor";
import { MahjongOption as Option, PaiName } from "../@types/types";
import { MahjongDefaultOption } from "../Runtime/MahjongDefaultOption";
import CalculationStepContext, { CalculationStepInitial, CalculationStepType } from "./Context/CalculationStepContext";
import PaiSelectionContext, { PaiOptionInitial, PaiOptionType } from "./Context/PaiSelectionContext";
import OptionContext from "./Context/OptionContext";

const ImportFromURL = () => {
  const [paiSelections, setPaiSelections] = useContext(PaiSelectionContext);
  const [option, setOption] = useContext(OptionContext);
  const [calculationStep, setCalculationStep] = useContext(CalculationStepContext);

  useEffect(() => {
    const url = new URL(location.href);
    const parsePaiListFromSearchParams = (name: string) =>
      (
        url.searchParams.get(name)?.split(/((?:[1-9][mps]|[1-7]z)[auhdf]*)/i) ??
        []
      ).filter((v) => v);

    const paiList = parsePaiListFromSearchParams("paiList");

    const parsePaiList = (paiListParams: string[]) =>
      paiListParams.map((pai) => {
        const [number, group, option] = PaiPatternExtractor.extractPaiPair(
          pai as PaiName,
        );
        const paiName = `${number}${group}` as PaiName;
        let index = paiNames.filter((v) => v !== paiName).sum();
        paiNames.push(paiName);
        return {
          pai: paiName,
          index,
          isHoraPai: option.isHoraPai ?? false,
          isAkaDora: option.isAkaDora ?? false,
          isUraDoraPai: option.isUraDora ?? false,
          isFuro: option.fromFuro,
          isDoraPai: option.isDora ?? false,
          isKanPai: option.isKanPai ?? false,
        };
      });

    const importedPaiList = parsePaiList(paiList)

    if (importedPaiList.length === 0) {
      return;
    }

    const paiNames: PaiName[] = [];
    setPaiSelections?.({
      paiList: importedPaiList,
    });

    if (url.searchParams.has("option")) {
      try {
        const optionParam = JSON.parse(url.searchParams.get("option") ?? "");
        setOption?.({
          ...MahjongDefaultOption,
          hora: {
            pai: optionParam.hora.fromPai ?? paiList[paiList.length - 1],
            fromRon: optionParam.hora.fromRon ?? false,
            fromTsumo: optionParam.hora.fromTsumo ?? false,
            fromRinshanPai: optionParam.hora.fromRinshanPai ?? false,
          },
          honba: optionParam.honba ?? 0,
          kaze: optionParam.kaze ?? "1z",
          jikaze: optionParam.jikaze ?? "1z",
          doraList: optionParam.doraList ?? [],
          uraDoraList: optionParam.uraDoraList ?? [],
          localRules: {
            threePlayStyle: {
              scoring: optionParam.localRules.scoring ?? "DISCOUNTED_TSUMO",
              roundUpUnder1000:
                optionParam.localRules.roundUpUnder1000 ?? false,
            },
            fu: {
              renfonPai: optionParam.localRules?.fu?.renfonPai ?? 4,
            },
            honba: optionParam.localRules?.honba ?? 300,
            kuitan: optionParam.localRules?.kuitan ?? true,
            akaDora: optionParam.localRules?.akaDora ?? true,
          },
          fuList: MahjongDefaultOption.fuList ?? [],
          yakuList: MahjongDefaultOption.yakuList ?? [],
          enableDoubleYakuman: true,
          additionalSpecialYaku: {
            withRiichi: optionParam.additionalSpecialYaku?.withRiichi,
            withDoubleRiichi:
            optionParam.additionalSpecialYaku?.withDoubleRiichi,
            withOpenRiichi: optionParam.additionalSpecialYaku?.withOpenRiichi,
            withIppatsu: optionParam.additionalSpecialYaku?.withIppatsu,
            withHaitei: optionParam.additionalSpecialYaku?.withHaitei,
            withHoutei: optionParam.additionalSpecialYaku?.withHoutei,
            withChanKan: optionParam.additionalSpecialYaku?.withChanKan,
            withTenho: optionParam.additionalSpecialYaku?.withTenho,
            withChiho: optionParam.additionalSpecialYaku?.withChiho,
            withNagashiMangan:
            optionParam.additionalSpecialYaku?.withNagashiMangan,
          },
        });
      } catch (e) {}
    }

    if (url.searchParams.has("calculationStep")) {
      const step = url.searchParams.get("calculationStep");
      if (
        step === "finish" ||
        step === "select-pai" ||
        step === "select-dora" ||
        step === "select-ura-dora" ||
        step === "select-hora-pai"
      ) {
        setCalculationStep?.({
          step,
        });
      }
    }
  }, []);

  return <></>
}

export default ImportFromURL
