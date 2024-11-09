import React, { useContext } from "react";
import { PaiGroupName } from "../../@types/types";
import MahjongScoreArea from "./MahjongScoreArea";
import MahjongPaiSelections from "./MahjongPaiSelections";
import DoCalculateButton from "./DoCalculateButton";
import OpenCalculationResultButton from "./OpenCalculationResultButton";
import CalculationStepContext from "../Context/CalculationStepContext";
import StepMessageButton from "./StepMessageButton";
import DialogContext from "../Context/DialogContext";

const Header = (props: {
  tabType: PaiGroupName | "option";
  clickTab: (value: PaiGroupName | "option") => void;
}) => {
  const [calculationStep, setCalculationStep] = useContext(
    CalculationStepContext,
  );
  const [dialog, setDialog] = useContext(DialogContext);

  return (
    <div className="header">
      <div className="title-container flex justify-between">
        <h1 className="title">麻雀点数計算機</h1>
        <div className="place-self-center">
          <div
            className="small-button"
            onClick={() =>
              setDialog?.({ open: true, openType: "score-list-view" })
            }
          >
            📊 点数表
          </div>
        </div>
      </div>
      <MahjongScoreArea />
      <div className="pl-2 pr-2">
        {(calculationStep?.step === "select-pai" ||
          calculationStep?.step === "error" ||
          calculationStep?.step === "finish") && (
          <OpenCalculationResultButton />
        )}
        {(calculationStep?.step === "select-dora" ||
          calculationStep?.step === "select-ura-dora" ||
          calculationStep?.step === "select-furo-pai" ||
          calculationStep?.step === "select-hora-pai") && <StepMessageButton />}
      </div>
      <MahjongPaiSelections />
      <ul className="grid grid-cols-5 gap-1 pai-selection-tab">
        <li
          className={`pai-selection-tab-item pai-selection-tab-item--m ${props.tabType === "m" ? "pai-selection-tab-item--active" : ""}`}
          onClick={() => props.clickTab("m")}
        >
          <ruby>
            萬子
            <rp>(</rp>
            <rt>マンズ</rt>
            <rp>)</rp>
          </ruby>
        </li>
        <li
          className={`pai-selection-tab-item pai-selection-tab-item--p ${props.tabType === "p" ? "pai-selection-tab-item--active" : ""}`}
          onClick={() => props.clickTab("p")}
        >
          <ruby>
            筒子
            <rp>(</rp>
            <rt>ピンズ</rt>
            <rp>)</rp>
          </ruby>
        </li>
        <li
          className={`pai-selection-tab-item pai-selection-tab-item--s ${props.tabType === "s" ? "pai-selection-tab-item--active" : ""}`}
          onClick={() => props.clickTab("s")}
        >
          <ruby>
            索子
            <rp>(</rp>
            <rt>ソウズ</rt>
            <rp>)</rp>
          </ruby>
        </li>
        <li
          className={`pai-selection-tab-item pai-selection-tab-item--z ${props.tabType === "z" ? "pai-selection-tab-item--active" : ""}`}
          onClick={() => props.clickTab("z")}
        >
          <ruby>
            字牌
            <rp>(</rp>
            <rt>ツーパイ</rt>
            <rp>)</rp>
          </ruby>
        </li>
        <li
          className={`pai-selection-tab-item pai-selection-tab-item--option ${props.tabType === "option" ? "pai-selection-tab-item--active" : ""}`}
          onClick={() => props.clickTab("option")}
        >
          設定
        </li>
      </ul>
      <div
        className={`pai-selection-tab-divider pai-selection-tab-divider--${props.tabType}`}
      ></div>
    </div>
  );
};
export default Header;
