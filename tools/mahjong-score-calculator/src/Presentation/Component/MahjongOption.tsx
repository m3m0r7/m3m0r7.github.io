import React, { useContext } from "react";
import CheckBox from "./Form/CheckBox";
import Radio from "./Form/Radio";
import OptionContext from "../Context/OptionContext";
import { PaiName } from "../../@types/types";
import PaiSelectionContext from "../Context/PaiSelectionContext";
import { PaiGenerator } from "../../Utilities/PaiGenerator";
import CalculationStepContext from "../Context/CalculationStepContext";
import { MahjongDefaultLocalRules } from "../../Runtime/MahjongDefaultOption";
import SystemOptionContext, {
  SystemDefaultOption,
} from "../Context/SystemOptionContext";
import DialogContext from "../Context/DialogContext";

const MahjongOption = () => {
  const [selection, setSelection] = useContext(PaiSelectionContext);
  const [option, setOption] = useContext(OptionContext);
  const [systemOption, setSystemOption] = useContext(SystemOptionContext);
  const [calculationStep, setCalculationStep] = useContext(
    CalculationStepContext,
  );
  const [dialog, setDialog] = useContext(DialogContext);

  return (
    <div>
      <h2 className="font-bold text-xl">ゲームの設定</h2>
      <ul>
        <li>
          <label>
            <Radio disabled defaultChecked={systemOption?.playStyle === 4} />
            四人麻雀
          </label>
        </li>
        <li>
          <label>
            <Radio disabled defaultChecked={systemOption?.playStyle === 3} />
            三人麻雀（未実装）
          </label>
        </li>
      </ul>

      <h2 className="font-bold mt-4 text-xl">麻雀のルール</h2>
      <ul>
        <li>
          <label>
            <CheckBox
              defaultChecked={option?.enableDoubleYakuman}
              onClick={(e) =>
                setOption?.({
                  ...option,
                  enableDoubleYakuman: e.currentTarget.checked,
                })
              }
            />
            ダブル役満
          </label>
        </li>
        <li>
          <label>
            <CheckBox
              defaultChecked={option?.localRules?.kuitan}
              onClick={(e) =>
                setOption?.({
                  ...option,
                  localRules: {
                    ...MahjongDefaultLocalRules,
                    ...option?.localRules,
                    kuitan: e.currentTarget.checked,
                  },
                })
              }
            />
            喰いタン
          </label>
        </li>
        <li>
          <label>
            <CheckBox
              defaultChecked={option?.localRules?.akaDora}
              onClick={(e) =>
                setOption?.({
                  ...option,
                  localRules: {
                    ...MahjongDefaultLocalRules,
                    ...option?.localRules,
                    akaDora: e.currentTarget.checked,
                  },
                })
              }
            />
            赤ドラ
          </label>
        </li>
      </ul>

      <h2 className="font-bold mt-4 text-xl">
        <ruby>
          連風牌
          <rp>(</rp>
          <rt>レンフォンパイ</rt>
          <rp>)</rp>
        </ruby>
        の符計算
      </h2>
      <ul className="grid grid-cols-4">
        <li className="mb-2">
          <label className="align-middle">
            <Radio
              name="renFon"
              value="4"
              defaultChecked={option?.localRules?.fu.renfonPai === 4}
              onClick={(e) =>
                setOption?.({
                  ...option,
                  localRules: {
                    ...MahjongDefaultLocalRules,
                    ...option?.localRules,
                    fu: {
                      renfonPai: Number(e.currentTarget.value),
                    },
                  },
                })
              }
            />
            4 符
          </label>
        </li>
        <li className="mb-2">
          <label className="align-middle">
            <Radio
              name="renFon"
              value="2"
              defaultChecked={option?.localRules?.fu.renfonPai === 2}
              onClick={(e) =>
                setOption?.({
                  ...option,
                  localRules: {
                    ...MahjongDefaultLocalRules,
                    ...option?.localRules,
                    fu: {
                      renfonPai: Number(e.currentTarget.value),
                    },
                  },
                })
              }
            />
            2 符
          </label>
        </li>
      </ul>

      <h2 className="font-bold mt-4 text-xl">システムの設定</h2>
      <ul>
        <li>
          <label>
            <CheckBox
              defaultChecked={systemOption?.ripai ?? false}
              onClick={(e) =>
                setSystemOption?.({
                  ...SystemDefaultOption,
                  ripai: e.currentTarget.checked,
                })
              }
            />
            点数計算後に選択された牌を
            <ruby>
              理牌
              <rp>(</rp>
              <rt>リーパイ</rt>
              <rp>)</rp>
            </ruby>
            （並べ替え）する
          </label>
        </li>
        <li>
          <label>
            <CheckBox
              defaultChecked={systemOption?.ripai ?? false}
              onClick={(e) =>
                setSystemOption?.({
                  ...SystemDefaultOption,
                  with500ScoreBar: e.currentTarget.checked,
                })
              }
            />
            500点棒を含めて計算する
          </label>
        </li>
      </ul>

      <h2 className="font-bold mt-4 text-xl">入力サポート</h2>
      <p>点数計算時の役の入力をサポートします</p>
      <button
        type="button"
        className="button primary-button w-full mt-2 outline-button"
        onClick={() => setDialog?.({ open: true, openType: "input-support" })}
      >
        入力サポートを開く
      </button>

      <h2 className="font-bold mt-4 text-xl">注意事項</h2>
      <p className="text-xs mt-4">
        ※和了牌を選択しなかった場合は、一番最初の牌を和了牌とみなして計算します
      </p>

      <p className="text-xs mt-4 text-red-500">
        ※一部のルールなどはまだ開発中です。普段打ってないやり方を逆に知らないのでプルリクエストお待ちしてます。
      </p>
    </div>
  );
};

export default MahjongOption;
