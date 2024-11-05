import React, { useEffect, useState } from "react";
import MahjongPaiList from "./Component/MahjongPaiList";
import "./index.css";
import {
  MahjongOption as Option,
  PaiGroupName,
  PaiName,
  ScoreData,
} from "../@types/types";
import MahjongOption from "./Component/MahjongOption";
import Footer from "./Component/Footer";
import Header from "./Component/Header";
import DoCalculateButton from "./Component/DoCalculateButton";
import {
  MahjongDefaultAdditionalSpecialYaku,
  MahjongDefaultOption,
} from "../Runtime/MahjongDefaultOption";
import DialogContext, { DialogType } from "./Context/DialogContext";
import OptionContext from "./Context/OptionContext";
import Dialog from "./Component/Dialog/Dialog";
import PaiSelectionContext, { PaiOption } from "./Context/PaiSelectionContext";
import CalculationStepContext, {
  CalculationStep,
} from "./Context/CalculationStepContext";
import ScoreDataContext from "./Context/ScoreDataContext";
import Layout from "./Component/Layout";
import { PaiPatternExtractor } from "../Runtime/Extractor/Extractor";
import SystemOptionContext, {
  SystemDefaultOption,
  SystemOption,
} from "./Context/SystemOptionContext";

const App = () => {
  const [tabType, setTabType] = useState<PaiGroupName | "option">("m");
  const [selectedPaiList, setSelectedPaiList] = useState<
    Record<number, PaiName>
  >({});

  const paiSelections = useState<PaiOption>({
    paiList: [],
  });

  const option = useState<Partial<Option>>(MahjongDefaultOption);
  const dialog = useState<DialogType>({
    open: false,
  });
  const calculationStep = useState<CalculationStep>({
    step: "select-pai",
  });
  const scoreData = useState<ScoreData | null>(null);
  const systemOption = useState<SystemOption>(SystemDefaultOption);

  useEffect(() => {
    const url = new URL(location.href);
    const paiList = (
      url.searchParams
        .get("paiList")
        ?.split(/((?:[1-9][mps]|[1-7]z)[auhdf]*)/i) ?? []
    ).filter((v) => v);

    const paiNames: PaiName[] = [];
    paiSelections[1]({
      paiList: paiList.map((pai) => {
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
        };
      }),
    });

    if (url.searchParams.has("option")) {
      try {
        const optionParam = JSON.parse(url.searchParams.get("option") ?? "");
        option[1]({
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
            withKokushiMusou13MenMachi:
              optionParam.additionalSpecialYaku?.withKokushiMusou13MenMachi,
            withJunseiChurenPoutou:
              optionParam.additionalSpecialYaku?.withJunseiChurenPoutou,
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
        calculationStep[1]({
          step,
        });
      }
    }
  }, []);

  return (
    <ScoreDataContext.Provider value={scoreData}>
      <CalculationStepContext.Provider value={calculationStep}>
        <PaiSelectionContext.Provider value={paiSelections}>
          <SystemOptionContext.Provider value={systemOption}>
            <OptionContext.Provider value={option}>
              <DialogContext.Provider value={dialog}>
                <Layout>
                  <Header tabType={tabType} clickTab={(v) => setTabType(v)} />

                  <div className="pai-container">
                    {tabType !== "option" && <MahjongPaiList type={tabType} />}
                    {tabType === "option" && <MahjongOption />}
                  </div>

                  <div className="calculation-button-position">
                    <div className="bg-white p-2">
                      <DoCalculateButton />
                    </div>
                  </div>

                  <Dialog />
                  <Footer />
                </Layout>
              </DialogContext.Provider>
            </OptionContext.Provider>
          </SystemOptionContext.Provider>
        </PaiSelectionContext.Provider>
      </CalculationStepContext.Provider>
    </ScoreDataContext.Provider>
  );
};

export default App;
