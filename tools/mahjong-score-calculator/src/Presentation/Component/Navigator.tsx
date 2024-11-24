import React, { useContext, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretLeft, faCaretRight } from "@fortawesome/free-solid-svg-icons";
import {
  backwardFrameSet,
  forwardFrameSet,
  haveBackwardFrameSet,
  haveForwardFrameSet,
} from "../Context/FrameSetContext";
import { PaiPatternExtractor } from "../../Runtime/Extractor/Extractor";
import { PaiName } from "../../@types/types";
import PaiSelectionContext from "../Context/PaiSelectionContext";

const Navigator = () => {
  const [_selection] = useContext(PaiSelectionContext);
  const selection = _selection ?? {
    paiList: [],
  };

  const needsRinshanPai = PaiPatternExtractor.needsRinshanPaiByPaiNameList(
    selection.paiList
      .filter((v) => v.pai)
      .map((v) => `${v.pai}${v.isKanPai ? "k" : ""}` as PaiName),
  );

  const remainingSelectionPai = useMemo(() => {
    return 14 + needsRinshanPai - (selection?.paiList.length ?? 0);
  }, [selection]);

  return (
    <div className="navigator grid grid-cols-12 items-center">
      <div className="col-span-1 text-center history-back">
        <button
          type="button"
          onClick={backwardFrameSet}
          disabled={!haveBackwardFrameSet()}
        >
          <FontAwesomeIcon icon={faCaretLeft} />
        </button>
      </div>
      <div className="col-span-1 text-center history-next">
        <button
          type="button"
          onClick={forwardFrameSet}
          disabled={!haveForwardFrameSet()}
        >
          <FontAwesomeIcon icon={faCaretRight} />
        </button>
      </div>
      {remainingSelectionPai > 0 && (
        <div className="col-span-10 text-center text-sm">
          残り{" "}
          <span className="font-bold text-red-700">
            {remainingSelectionPai}
          </span>{" "}
          牌選んでください
        </div>
      )}
      {remainingSelectionPai === 0 && (
        <div className="col-span-10 text-center text-sm">
          ページ下部の{" "}
          <span className="font-bold text-red-700">点数計算を開始する</span>{" "}
          をタップ
        </div>
      )}
    </div>
  );
};

export default Navigator;
