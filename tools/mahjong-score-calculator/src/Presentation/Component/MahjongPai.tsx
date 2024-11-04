import React, { useContext } from "react";
import { PaiGroupName, PaiName } from "../../@types/types";
import { createURL } from "../Option";
import DialogContext from "../Context/DialogContext";
import PaiSelectionContext from "../Context/PaiSelectionContext";
import OptionContext from "../Context/OptionContext";

const MahjongPai = (props: {
  number: number;
  index: number;
  type: PaiGroupName;
}) => {
  const [option, setOption] = useContext(OptionContext);
  const [dialog, setDialog] = useContext(DialogContext);
  const [_selections] = useContext(PaiSelectionContext);

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

  const openDialog = () => {
    setDialog?.({
      open: true,
      openType: "select-pai",
      value: {
        pai,
        index: props.index,
        isAkaDora,
      },
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
        onClick={openDialog}
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
