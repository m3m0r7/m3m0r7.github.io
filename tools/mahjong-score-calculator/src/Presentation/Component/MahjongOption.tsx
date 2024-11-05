import React, { useContext } from "react";
import CheckBox from "./Form/CheckBox";
import Radio from "./Form/Radio";
import OptionContext from "../Context/OptionContext";
import { PaiName } from "../../@types/types";
import PaiSelectionContext from "../Context/PaiSelectionContext";
import { PaiGenerator } from "../../Utilities/PaiGenerator";
import CalculationStepContext from "../Context/CalculationStepContext";
import { MahjongDefaultLocalRules } from "../../Runtime/MahjongDefaultOption";
import SystemOptionContext, { SystemDefaultOption } from "../Context/SystemOptionContext";

const MahjongOption = () => {
  const [selection, setSelection] = useContext(PaiSelectionContext);
  const [option, setOption] = useContext(OptionContext);
  const [systemOption, setSystemOption] = useContext(SystemOptionContext);
  const [calculationStep, setCalculationStep] = useContext(
    CalculationStepContext,
  );

  const applyTanyao = () => {
    const paiList = [
      "2m",
      "3m",
      "4m",
      "5m",
      "6m",
      "7m",

      "3p",
      "4p",
      "5p",
      "6p",
      "7p",
      "8p",

      "2s",
      "2s",
    ].map((pai) => ({
      index: 0,
      isFuro: false,
      isHoraPai: false,
      isDoraPai: false,
      isAkaDora: false,
      isUraDoraPai: false,
      pai: pai as PaiName,
    }));
    paiList[0].isHoraPai = true;

    setCalculationStep?.({
      step: "select-pai",
    });

    setSelection?.({
      paiList,
    });
  };

  const applyKokushiMusou = () => {
    const paiList = [
      ...PaiGenerator.generateKokushiMusou13MenMachi(),
      "1m",
    ].map((pai) => ({
      index: 0,
      isFuro: false,
      isHoraPai: false,
      isDoraPai: false,
      isAkaDora: false,
      isUraDoraPai: false,
      pai: pai as PaiName,
    }));
    paiList[0].isHoraPai = true;

    setCalculationStep?.({
      step: "select-pai",
    });

    setSelection?.({
      paiList,
    });
  };

  const applyTanyaoButDoubleYakuman = () => {
    setSelection?.({
      paiList: [
        {
          pai: "2m",
          index: 0,
          isFuro: false,
          isHoraPai: false,
          isDoraPai: false,
          isAkaDora: false,
          isUraDoraPai: false,
        },
        {
          pai: "3m",
          index: 0,
          isFuro: false,
          isHoraPai: false,
          isDoraPai: false,
          isAkaDora: false,
          isUraDoraPai: false,
        },
        {
          pai: "4m",
          index: 0,
          isFuro: false,
          isHoraPai: false,
          isDoraPai: false,
          isAkaDora: false,
          isUraDoraPai: false,
        },
        {
          pai: "2m",
          index: 1,
          isFuro: false,
          isHoraPai: false,
          isDoraPai: false,
          isAkaDora: false,
          isUraDoraPai: false,
        },
        {
          pai: "3m",
          index: 1,
          isFuro: false,
          isHoraPai: false,
          isDoraPai: false,
          isAkaDora: false,
          isUraDoraPai: false,
        },
        {
          pai: "4m",
          index: 1,
          isFuro: false,
          isHoraPai: false,
          isDoraPai: false,
          isAkaDora: false,
          isUraDoraPai: false,
        },
        {
          pai: "2m",
          index: 2,
          isFuro: false,
          isHoraPai: false,
          isDoraPai: false,
          isAkaDora: false,
          isUraDoraPai: false,
        },
        {
          pai: "3m",
          index: 2,
          isFuro: false,
          isHoraPai: false,
          isDoraPai: false,
          isAkaDora: false,
          isUraDoraPai: false,
        },
        {
          pai: "4m",
          index: 2,
          isFuro: false,
          isHoraPai: false,
          isDoraPai: false,
          isAkaDora: false,
          isUraDoraPai: false,
        },

        {
          pai: "2p",
          index: 0,
          isFuro: false,
          isHoraPai: false,
          isDoraPai: false,
          isAkaDora: false,
          isUraDoraPai: false,
        },
        {
          pai: "2p",
          index: 1,
          isFuro: false,
          isHoraPai: false,
          isDoraPai: false,
          isAkaDora: false,
          isUraDoraPai: false,
        },
        {
          pai: "2p",
          index: 2,
          isFuro: false,
          isHoraPai: false,
          isDoraPai: false,
          isAkaDora: false,
          isUraDoraPai: false,
        },

        {
          pai: "5m",
          index: 0,
          isFuro: false,
          isHoraPai: false,
          isDoraPai: false,
          isAkaDora: false,
          isUraDoraPai: false,
        },
        {
          pai: "5m",
          index: 1,
          isFuro: false,
          isHoraPai: true,
          isDoraPai: false,
          isAkaDora: false,
          isUraDoraPai: false,
        },
      ],
    });

    setCalculationStep?.({
      step: "select-pai",
    });
  };

  return (
    <div>
      <h2 className="font-bold text-xl">ゲームの設定</h2>
      <ul>
        <li>
          <label>
            <Radio disabled defaultChecked={systemOption?.playStyle === 4}/>
            四人麻雀
          </label>
        </li>
        <li>
          <label>
            <Radio disabled defaultChecked={systemOption?.playStyle === 3}/>
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

      <h2 className="font-bold mt-4 text-xl">連風牌の符</h2>
      <ul className="grid grid-cols-4">
        <li className="mb-2">
          <label className="align-middle">
            <Radio
              name="renFon"
              value="0"
              defaultChecked={option?.localRules?.fu.renfonPai === 0}
            />
            符なし
          </label>
        </li>
        <li className="mb-2">
          <label className="align-middle">
            <Radio
              name="renFon"
              value="2"
              defaultChecked={option?.localRules?.fu.renfonPai === 2}
            />
            2 符
          </label>
        </li>
        <li className="mb-2">
          <label className="align-middle">
            <Radio
              name="renFon"
              value="4"
              defaultChecked={option?.localRules?.fu.renfonPai === 4}
            />
            4 符
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
            </ruby>する
          </label>
        </li>
      </ul>

      <h2 className="font-bold mt-4 text-xl">お試し</h2>
      <button
        type="button"
        className="button primary-button w-full mt-2 outline-button"
        onClick={applyTanyao}
      >
        <ruby>
          断么九
          <rp>(</rp>
          <rt>タンヤオ</rt>
          <rp>)</rp>
        </ruby>
        の計算をしてみる
      </button>
      <button
        type="button"
        className="button primary-button w-full mt-2 outline-button"
        onClick={applyKokushiMusou}
      >
        <ruby>
          国士無双
          <rp>(</rp>
          <rt>コクシムソウ</rt>
          <rp>)</rp>
        </ruby>
        の計算をしてみる
      </button>
      <button
        type="button"
        className="button primary-button w-full mt-2 outline-button"
        onClick={applyTanyaoButDoubleYakuman}
      >
        <ruby>
          断么九
          <rp>(</rp>
          <rt>タンヤオ</rt>
          <rp>)</rp>
        </ruby>
        （AA でおなじみの方）の計算をしてみる
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
