import React, { useContext } from "react";
import { PaiGroupName, PaiName } from "../../@types/types";
import { createURL } from "../Option";
import DialogContext from "../Context/DialogContext";
import PaiSelectionContext from "../Context/PaiSelectionContext";
import OptionContext from "../Context/OptionContext";
import { PaiPatternExtractor } from "../../Runtime/Extractor/Extractor";

const MahjongPai = (props: {
  number: number;
  index: number;
  type: PaiGroupName;
}) => {
  const [option, setOption] = useContext(OptionContext);
  const [dialog, setDialog] = useContext(DialogContext);
  const [_selections] = useContext(PaiSelectionContext);
  const [paiSelections, setPaiSelections] = useContext(PaiSelectionContext);

  const selection = _selections ?? {
    paiList: [],
  };

  if (!dialog || !setDialog) {
    return null;
  }

  const pai = `${props.number}${props.type}` as PaiName;
  const isAkaDora =
    (option?.localRules?.akaDora ?? false) &&
    props.index === 3 &&
    (pai === "5m" || pai === "5p" || pai === "5s");

  const registerPai = () => {
    const [number] = PaiPatternExtractor.extractPaiPair(pai);
    setPaiSelections?.({
      paiList: [
        ...(paiSelections?.paiList ?? []),
        {
          index: props.index,
          pai,
          isHoraPai: false,
          isDoraPai: false,
          isFuro: false,
          isAkaDora,
          isUraDoraPai: false,
        },
      ],
      needsRinshanPai: 0,
      rinshanPaiList: [],
    });
  };

  return (
    <div>
      <button
        type="button"
        className="pai"
        disabled={
          selection.paiList.length >= 14 ||
          selection.paiList.some(
            (selection) =>
              selection.pai === pai && selection.index === props.index,
          )
        }
        onClick={registerPai}
      >
        <img
          src={createURL(
            `images/pai/${props.number}${props.type}${isAkaDora ? "a" : ""}.png`,
          )}
          width="100%"
        />
      </button>
    </div>
  );
};

export default MahjongPai;
