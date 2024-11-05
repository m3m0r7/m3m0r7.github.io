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
    needsRinshanPai: 0,
    rinshanPaiList: [],
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
    // NOTE: If already selected same 3 pai, confirming to user "want you to kan?".
    const paiList = selection.paiList.filter((v) => {
      const [aNumber, aGroup] = PaiPatternExtractor.extractPaiPair(v.pai);
      const [bNumber, bGroup] = PaiPatternExtractor.extractPaiPair(pai);

      return `${aNumber}${aGroup}` === `${bNumber}${bGroup}`;
    });

    const [number] = PaiPatternExtractor.extractPaiPair(pai);
    setPaiSelections?.({
      ...(paiSelections ?? {
        needsRinshanPai: 0,
        rinshanPaiList: [],
      }),
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
    });

    if (paiList.length === 3) {
      setDialog?.({
        open: true,
        openType: "confirm-kan",
      });
    }
  };

  return (
    <div>
      <button
        type="button"
        className="pai"
        disabled={
          selection.paiList.length + selection.rinshanPaiList.length >=
            14 + selection.needsRinshanPai ||
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
