import React, { useState } from "react";
import MahjongPaiList from "./Component/MahjongPaiList";
import "./index.css";
import { MahjongOption as Option, PaiGroupName, PaiName, ScoreData, } from "../@types/types";
import MahjongOption from "./Component/MahjongOption";
import Footer from "./Component/Footer";
import Header from "./Component/Header";
import DoCalculateButton from "./Component/DoCalculateButton";
import { MahjongDefaultOption } from "../Runtime/MahjongDefaultOption";
import DialogContext, { DialogInitial, DialogType, } from "./Context/DialogContext";
import OptionContext from "./Context/OptionContext";
import Dialog from "./Component/Dialog/Dialog";
import PaiSelectionContext, { PaiOptionInitial, PaiOptionType, } from "./Context/PaiSelectionContext";
import CalculationStepContext, { CalculationStepInitial, CalculationStepType, } from "./Context/CalculationStepContext";
import ScoreDataContext from "./Context/ScoreDataContext";
import Layout from "./Component/Layout";
import SystemOptionContext, { SystemDefaultOption, SystemOption, } from "./Context/SystemOptionContext";
import FrameSetContext, { createFrameSet } from "./Context/FrameSetContext";
import DrawerMenuContext, { DrawerMenuInitial, DrawerMenuType, } from "./Context/DrawerMenuContext";
import Drawer from "./Component/Drawer/Drawer";
import { CookiesProvider, useCookies } from "react-cookie";
import ImportFromURL from "./ImportFromURL";
import KeyboardShortcut from "./KeyboardShortcut/KeyboardShortcut";

const App = () => {
  const [tabType, setTabType] = useState<PaiGroupName | "option">("m");
  const [selectedPaiList, setSelectedPaiList] = useState<
    Record<number, PaiName>
  >({});

  const paiSelections = useState<PaiOptionType>(PaiOptionInitial);

  const [cookies, setCookie, removeCookie] = useCookies();
  const drawer = useState<DrawerMenuType>(DrawerMenuInitial);
  const option = useState<Partial<Option>>(
    cookies.option ?? MahjongDefaultOption,
  );
  const dialog = useState<DialogType>(DialogInitial);
  const calculationStep = useState<CalculationStepType>(CalculationStepInitial);
  const scoreData = useState<ScoreData | null>(null);
  const systemOption = useState<SystemOption>(SystemDefaultOption);

  return (
    <CookiesProvider>
      <FrameSetContext>
        <ScoreDataContext.Provider value={scoreData}>
          <CalculationStepContext.Provider value={calculationStep}>
            <PaiSelectionContext.Provider
              value={createFrameSet<PaiOptionType>(paiSelections)}
            >
              <SystemOptionContext.Provider
                value={createFrameSet<SystemOption>(systemOption)}
              >
                <OptionContext.Provider
                  value={createFrameSet<Partial<Option>>(option)}
                >
                  <DialogContext.Provider value={dialog}>
                    <DrawerMenuContext.Provider value={drawer}>
                      <ImportFromURL />
                      <KeyboardShortcut />
                      <Layout>
                        <Header
                          tabType={tabType}
                          clickTab={(v) => setTabType(v)}
                        />

                        <div className="pai-container">
                          {tabType !== "option" && (
                            <MahjongPaiList type={tabType} />
                          )}
                          {tabType === "option" && <MahjongOption />}
                        </div>

                        <div className="calculation-button-position">
                          <div className="bg-white p-2">
                            <DoCalculateButton />
                          </div>
                        </div>

                        <Dialog />
                        <Drawer />
                        <Footer />
                      </Layout>
                    </DrawerMenuContext.Provider>
                  </DialogContext.Provider>
                </OptionContext.Provider>
              </SystemOptionContext.Provider>
            </PaiSelectionContext.Provider>
          </CalculationStepContext.Provider>
        </ScoreDataContext.Provider>
      </FrameSetContext>
    </CookiesProvider>
  );
};

export default App;
