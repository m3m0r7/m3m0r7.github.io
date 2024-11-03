import React, { useContext, useRef } from "react";
import CheckBox from "../Form/CheckBox";
import DialogContext, { DialogType } from "../../Context/DialogContext";
import PaiSelectionContext, {
  PaiSelectionType,
} from "../../Context/PaiSelectionContext";
import { PaiPatternExtractor } from "../../../Runtime/Extractor/Extractor";

const name: DialogType["openType"] = "select-pai";

const DialogSelectPai = () => {
  const [dialog, setDialog] = useContext(DialogContext);
  const [paiSelections, setPaiSelections] = useContext(PaiSelectionContext);
  const horaRef = useRef<HTMLInputElement | null>(null);
  const doraRef = useRef<HTMLInputElement | null>(null);
  const furoRef = useRef<HTMLInputElement | null>(null);
  const akaDoraRef = useRef<HTMLInputElement | null>(null);

  if (!dialog || !setDialog || !dialog.open || name !== dialog.openType) {
    return null;
  }

  const [number] = PaiPatternExtractor.extractPaiPair(dialog.value.pai);

  const registerPai = () => {
    setPaiSelections?.({
      paiList: [
        ...(paiSelections?.paiList ?? []),
        {
          index: dialog.value.index,
          pai: dialog.value.pai,
          isHoraPai: horaRef.current?.checked ?? false,
          isDoraPai: doraRef.current?.checked ?? false,
          isFuro: furoRef.current?.checked ?? false,
          isAkaDora: furoRef.current?.checked ?? false,
          isUraDoraPai: false,
        },
      ],
    });

    setDialog({ open: false });
  };

  return (
    <div className="dialog">
      <div className="dialog-title">牌について教えて下さい</div>
      <div className="dialog-contents">
        <ul>
          <li className="mb-2">
            <label className="align-middle">
              <CheckBox ref={horaRef} />
              <ruby>
                和了
                <rp>(</rp>
                <rt>あがり</rt>
                <rp>)</rp>
              </ruby>
              牌ですか？
            </label>
          </li>

          <li className="mb-2">
            <label className="align-middle">
              <CheckBox ref={furoRef} />
              鳴いた牌ですか？（ポン/チー/カン）
            </label>
          </li>

          {parseInt(number) === 5 && (
            <li className="mb-2">
              <label className="align-middle">
                <CheckBox ref={akaDoraRef} />
                赤ドラですか？
              </label>
            </li>
          )}
        </ul>
      </div>
      <div className="dialog-footer mt-2 mb-3 grid grid-cols-2 gap-2 ml-3 mr-3">
        <button
          type="button"
          className="button primary-button outline-button"
          onClick={() => setDialog?.({ open: false })}
        >
          キャンセルする
        </button>
        <button
          type="button"
          className="button primary-button"
          onClick={registerPai}
        >
          登録する
        </button>
      </div>
    </div>
  );
};

export default DialogSelectPai;
