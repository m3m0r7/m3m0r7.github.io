import React, { useContext } from "react";
import { PaiGroupName, PaiName } from "../../@types/types";
import { createURL } from "../Option";
import DialogContext from "../Context/DialogContext";
import PaiSelectionContext from "../Context/PaiSelectionContext";
import OptionContext from "../Context/OptionContext";
import { PaiPatternExtractor } from "../../Runtime/Extractor/Extractor";
import { convertToNormalPai } from "../../Utilities/Converter";

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
    // NOTE: If already selected same 3 pai, confirming to user "want you to kan?".
    const paiList = selection.paiList.filter((v) => {
      const [aNumber, aGroup] = PaiPatternExtractor.extractPaiPair(v.pai);
      const [bNumber, bGroup] = PaiPatternExtractor.extractPaiPair(pai);

      return `${aNumber}${aGroup}` === `${bNumber}${bGroup}`;
    });

    const [number] = PaiPatternExtractor.extractPaiPair(pai);
    setPaiSelections?.({
      ...(paiSelections ?? {}),
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
          isKanPai: false,
        },
      ],
    });

    if (paiList.length === 3) {
      setDialog?.({
        open: true,
        openType: "confirm-kan",
        // NOTE: Remove kan information
        value: pai.replace("k", "") as PaiName,
      });
    }
  };

  const peNuki = () => {
    setDialog?.({
      open: true,
      openType: "pe-nuki",
      index: props.index,
    });
  };

  const needsRinshanPai = PaiPatternExtractor.needsRinshanPaiByPaiNameList(
    selection.paiList
      .filter((v) => v.pai)
      .map((v) => `${v.pai}${v.isKanPai ? "k" : ""}` as PaiName),
  );

  const isThreePlayerStyleAndAvailableManzu =
    option?.playStyle === 3 &&
    !(props.number === 1 || props.number === 9) &&
    props.type === "m";

  const wasPeNuki = pai === "4z" && selection.peNukiList?.includes(props.index);

  return (
    <div>
      <button
        type="button"
        className="pai"
        disabled={
          selection.paiList.length >= 14 + needsRinshanPai ||
          selection.paiList.some(
            (selection) =>
              convertToNormalPai(selection.pai) === convertToNormalPai(pai) &&
              selection.index === props.index,
          ) ||
          isThreePlayerStyleAndAvailableManzu ||
          wasPeNuki
        }
        onClick={option?.playStyle === 3 && pai === "4z" ? peNuki : registerPai}
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
