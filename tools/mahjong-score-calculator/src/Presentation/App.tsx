import React, { useContext, useState } from 'react';
import MahjongPaiList from "./Component/MahjongPaiList";
import './index.css'
import { MahjongOption as Option, PaiGroupName, PaiName, ScoreData } from "../@types/types";
import MahjongOption from "./Component/MahjongOption";
import Footer from "./Component/Footer";
import Header from "./Component/Header";
import DoCalculateButton from "./Component/DoCalculateButton";
import { MahjongDefaultOption } from "../Runtime/MahjongDefaultOption";
import DialogContext, { DialogType } from "./Context/DialogContext";
import OptionContext from "./Context/OptionContext";
import Dialog from "./Component/Dialog/Dialog";
import PaiSelectionContext, { PaiOption, PaiOptionInfo } from "./Context/PaiSelectionContext";
import CalculationStepContext, { CalculationStep } from "./Context/CalculationStepContext";
import ScoreDataContext from "./Context/ScoreDataContext";

const App = () => {
  const [tabType, setTabType] = useState<PaiGroupName | 'option'>('m')
  const [selectedPaiList, setSelectedPaiList] = useState<Record<number, PaiName>>({})

  const paiSelections = useState<PaiOption>({
    paiList: [
      ...[
        "2m",
        "3m",
        "4m",
        "5m",
        "6m",
        "7m",

        "3p",
        "4p",
        "5p",
        "6p",
        "7p",
        "8p",

        "2s",
        "2s",
      ].map((pai) => ({ index: 0, isFuro: false, isHoraPai: false, isDoraPai: false, isAkaDora: false, pai: pai as PaiName }))
      // // NOTE: for testing automatically inputting
      // ...Array.from({ length: 9 }, (_, k) => k).map<PaiOptionInfo>(v => ({
      //   pai: `${v + 1}m` as PaiName,
      //   index: 0,
      //   isFuro: false,
      //   isAkaDora: false,
      // })),
      // ...Array.from({ length: 5 }, (_, k) => k).map<PaiOptionInfo>(v => ({
      //   pai: `${v + 1}m` as PaiName,
      //   index: 1,
      //   isFuro: false,
      //   isAkaDora: false,
      // })),
    ],
  })

  const option = useState<Partial<Option>>(MahjongDefaultOption)
  const dialog = useState<DialogType>({
    open: false,
  })
  const calculationStep = useState<CalculationStep>({
    step: 'select-pai',
  })
  const scoreData = useState<ScoreData | null>(null)

  return <ScoreDataContext.Provider value={scoreData}>
    <CalculationStepContext.Provider value={calculationStep}>
      <PaiSelectionContext.Provider value={paiSelections}>
        <OptionContext.Provider value={option}>
          <DialogContext.Provider value={dialog}>
            <Header tabType={tabType} clickTab={(v) => setTabType(v)} />

            <div className="pai-container">
              {tabType !== 'option' && <MahjongPaiList type={tabType}/>}
              {tabType === 'option' && <MahjongOption />}
            </div>

            <div className="calculation-button-position pl-2 pr-2">
              <DoCalculateButton />
            </div>

            <Dialog />
            <Footer />
          </DialogContext.Provider>
        </OptionContext.Provider>
      </PaiSelectionContext.Provider>
    </CalculationStepContext.Provider>
  </ScoreDataContext.Provider>;
};

export default App;
