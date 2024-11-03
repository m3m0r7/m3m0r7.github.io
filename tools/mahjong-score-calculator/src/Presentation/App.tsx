import React, { useState } from "react";
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
import { MahjongDefaultOption } from "../Runtime/MahjongDefaultOption";
import DialogContext, { DialogType } from "./Context/DialogContext";
import OptionContext from "./Context/OptionContext";
import Dialog from "./Component/Dialog/Dialog";
import PaiSelectionContext, { PaiOption } from "./Context/PaiSelectionContext";
import CalculationStepContext, {
  CalculationStep,
} from "./Context/CalculationStepContext";
import ScoreDataContext from "./Context/ScoreDataContext";
import Layout from "./Component/Layout";

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

  return (
    <ScoreDataContext.Provider value={scoreData}>
      <CalculationStepContext.Provider value={calculationStep}>
        <PaiSelectionContext.Provider value={paiSelections}>
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
        </PaiSelectionContext.Provider>
      </CalculationStepContext.Provider>
    </ScoreDataContext.Provider>
  );
};

export default App;
