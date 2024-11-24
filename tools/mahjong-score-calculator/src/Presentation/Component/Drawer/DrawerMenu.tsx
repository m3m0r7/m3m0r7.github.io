import React, { useContext, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartSimple,
  faCheck, faCircleQuestion,
  faShareFromSquare,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import DialogContext from "../../Context/DialogContext";
import DrawerMenuContext from "../../Context/DrawerMenuContext";
import PaiSelectionContext, {
  PaiOptionInfo,
} from "../../Context/PaiSelectionContext";
import CalculationStepContext from "../../Context/CalculationStepContext";
import OptionContext from "../../Context/OptionContext";

const DrawerMenu = () => {
  const [_selections, setSelections] = useContext(PaiSelectionContext);
  const [drawer, setDrawer] = useContext(DrawerMenuContext);
  const [dialog, setDialog] = useContext(DialogContext);
  const [calculationStep, setCalculationStep] = useContext(
    CalculationStepContext,
  );
  const selection = _selections ?? {
    paiList: [],
  };
  const [option] = useContext(OptionContext);
  const [copied, setCopied] = useState(false);

  const closeDrawer = () => {
    setDrawer?.({
      open: false,
    });
  };

  const showScoreListView = () => {
    closeDrawer();

    setDialog?.({
      open: true,
      openType: "score-list-view",
    });
  };

  const createFullURL = () => {
    const defaultUrl = new URL(location.href);
    const toPaiText = (pai: PaiOptionInfo) => {
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
    };

    defaultUrl.searchParams.set(
      "paiList",
      selection.paiList.map(toPaiText).join(""),
    );

    if (calculationStep?.step) {
      defaultUrl.searchParams.set("calculationStep", calculationStep.step);
    }
    defaultUrl.searchParams.set("option", JSON.stringify(option));
    return defaultUrl.toString();
  };

  const shareURL = () => {
    navigator.clipboard.writeText(createFullURL());
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1500);
  };

  const showDialogHelp = () => {
    closeDrawer();

    setDialog?.({
      open: true,
      openType: "help",
    });
  }

  const showDialogAttention = () => {
    closeDrawer();

    setDialog?.({
      open: true,
      openType: "attention",
    });
  }

  return (
    <div className="drawer-menu">
      <div className="drawer-menu-content">
        <h1>コンテンツ</h1>
        <ul className="drawer-menu-list">
          <li onClick={showScoreListView}>
            <span>
              <FontAwesomeIcon icon={faChartSimple}/>
            </span>
            <span>点数計算表</span>
          </li>
          <li onClick={shareURL}>
            <span>
              {copied ? (
                <FontAwesomeIcon icon={faCheck}/>
              ) : (
                <FontAwesomeIcon icon={faShareFromSquare}/>
              )}
            </span>
            <span>{copied ? "コピー完了" : "URL のシェア"}</span>
          </li>
          <li onClick={showDialogHelp}>
            <span>
              <FontAwesomeIcon icon={faCircleQuestion}/>
            </span>
            <span>ヘルプ</span>
          </li>
          <li onClick={showDialogAttention}>
            <span>
              <FontAwesomeIcon icon={faTriangleExclamation}/>
            </span>
            <span>当サイトにおける注意事項</span>
          </li>
        </ul>
      </div>
    </div>
  );
};
export default DrawerMenu;
