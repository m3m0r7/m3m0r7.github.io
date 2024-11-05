import React, { useContext } from "react";
import DialogContext, { DialogType } from "../../Context/DialogContext";
import Radio from "../Form/Radio";
import CheckBox from "../Form/CheckBox";
import {
  ChanKan,
  Chiho,
  DoubleRiichi,
  Haitei,
  Houtei,
  Ippatsu,
  JunseiChurenPoutou,
  KokushiMusou13MenMachi,
  NagashiMangan,
  OpenRiichi,
  Riichi,
  RinshanKaihou,
  Tenho,
} from "../../../Yaku";
import CalculationStepContext from "../../Context/CalculationStepContext";
import OptionContext from "../../Context/OptionContext";
import { PaiKazeName } from "../../../@types/types";
import { MahjongDefaultAdditionalSpecialYaku } from "../../../Runtime/MahjongDefaultOption";
import PaiSelectionContext, {
  PaiOptionInfo,
} from "../../Context/PaiSelectionContext";
import ScoreDataContext from "../../Context/ScoreDataContext";

const name: DialogType["openType"] = "score-calculation";

const DialogScoreCalculation = () => {
  const [dialog, setDialog] = useContext(DialogContext);
  const [scoreData, setScoreData] = useContext(ScoreDataContext);
  const [option, setOption] = useContext(OptionContext);
  const [calculationStep, setCalculationStep] = useContext(
    CalculationStepContext,
  );
  const [selection] = useContext(PaiSelectionContext);

  if (!dialog?.open || name !== dialog?.openType) {
    return null;
  }

  const applyOptions = () => {
    const yakuList: HTMLInputElement[] = [
      ...document.querySelectorAll<HTMLInputElement>(
        '.DialogScoreCalculation [name="yaku[]"]:checked',
      ),
    ];
    const honba = document.querySelector<HTMLInputElement>(
      '.DialogScoreCalculation [name="honba"]:checked',
    )?.value;
    const horaFrom = document.querySelector<HTMLInputElement>(
      '.DialogScoreCalculation [name="horaFrom"]:checked',
    )?.value;
    const chanFon = document.querySelector<HTMLInputElement>(
      '.DialogScoreCalculation [name="chanFon"]:checked',
    )?.value;
    const menFon = document.querySelector<HTMLInputElement>(
      '.DialogScoreCalculation [name="menFon"]:checked',
    )?.value;

    const rinshanKaihou = yakuList.some(
      (yaku) => yaku.value === RinshanKaihou.name,
    );
    setOption?.({
      ...option,
      hora: {
        pai:
          selection?.paiList?.find(
            (paiOptionInfo: PaiOptionInfo) => paiOptionInfo.isHoraPai,
          )?.pai ??
          selection?.paiList?.[0].pai ??
          "1m",
        fromRon: Number(horaFrom) == 2 && !rinshanKaihou,
        fromTsumo: Number(horaFrom) == 1 || rinshanKaihou,
        fromRinshanPai: rinshanKaihou,
      },
      doraList: selection?.paiList
        ?.filter((v) => !v.isDoraPai)
        .map((v) => v.pai),
      uraDoraList: selection?.paiList
        ?.filter((v) => !v.isUraDoraPai)
        .map((v) => v.pai),
      honba: Number(honba),
      kaze: chanFon as PaiKazeName,
      jikaze: menFon as PaiKazeName,
      additionalSpecialYaku: {
        ...MahjongDefaultAdditionalSpecialYaku,
        withRiichi: yakuList.some((yaku) => yaku.value === Riichi.name),
        withDoubleRiichi: yakuList.some(
          (yaku) => yaku.value === DoubleRiichi.name,
        ),
        withOpenRiichi: yakuList.some((yaku) => yaku.value === OpenRiichi.name),
        withIppatsu: yakuList.some((yaku) => yaku.value === Ippatsu.name),
        withHaitei: yakuList.some((yaku) => yaku.value === Haitei.name),
        withHoutei: yakuList.some((yaku) => yaku.value === Houtei.name),
        withChanKan: yakuList.some((yaku) => yaku.value === ChanKan.name),
        withTenho: yakuList.some((yaku) => yaku.value === Tenho.name),
        withChiho: yakuList.some((yaku) => yaku.value === Chiho.name),
        withNagashiMangan: yakuList.some(
          (yaku) => yaku.value === NagashiMangan.name,
        ),
        withJunseiChurenPoutou: yakuList.some(
          (yaku) => yaku.value === JunseiChurenPoutou.name,
        ),
        withKokushiMusou13MenMachi: yakuList.some(
          (yaku) => yaku.value === KokushiMusou13MenMachi.name,
        ),
      },
    });
  };

  const doCalculate = () => {
    setScoreData?.(null)
    setCalculationStep?.({
      step: "finish",
    });
    applyOptions();
    setDialog?.({
      open: false,
    });
  };

  const doSelectDora = () => {
    setCalculationStep?.({
      step: "select-dora",
    });
    applyOptions();
    setDialog?.({
      open: false,
    });
  };

  return (
    <div className="DialogScoreCalculation dialog">
      <div className="dialog-title">点数計算の設定をしてください</div>
      <div className="dialog-contents">
        <h2 className="font-bold text-xl">和了（あがり方）</h2>
        <ul className="grid grid-cols-2">
          <li className="mb-2">
            <label className="align-middle">
              <Radio name="horaFrom" value="1" defaultChecked />
              <ruby>
                門前清自摸和
                <rp>(</rp>
                <rt>ツモ</rt>
                <rp>)</rp>
              </ruby>
            </label>
          </li>
          <li className="mb-2">
            <label className="align-middle">
              <Radio name="horaFrom" value="2" />
              ロン
            </label>
          </li>
        </ul>

        <h2 className="font-bold mt-4 text-xl">場風（チャンフォン）</h2>
        <ul className="grid grid-cols-2">
          <li className="mb-2">
            <label className="align-middle">
              <Radio name="chanFon" value="1z" defaultChecked />
              <ruby>
                東<rp>(</rp>
                <rt>トン</rt>
                <rp>)</rp>
              </ruby>
            </label>
          </li>
          <li className="mb-2">
            <label className="align-middle">
              <Radio name="chanFon" value="2z" />
              <ruby>
                南<rp>(</rp>
                <rt>トン</rt>
                <rp>)</rp>
              </ruby>
            </label>
          </li>
          <li className="mb-2">
            <label className="align-middle">
              <Radio name="chanFon" value="3z" />
              <ruby>
                西<rp>(</rp>
                <rt>シャー</rt>
                <rp>)</rp>
              </ruby>
            </label>
          </li>
          <li className="mb-2">
            <label className="align-middle">
              <Radio name="chanFon" value="4z" />
              <ruby>
                北<rp>(</rp>
                <rt>ぺー</rt>
                <rp>)</rp>
              </ruby>
            </label>
          </li>
        </ul>

        <h2 className="font-bold mt-4 text-xl">自風（メンフォン）</h2>
        <ul className="grid grid-cols-2">
          <li className="mb-2">
            <label className="align-middle">
              <Radio name="menFon" value="1z" defaultChecked />
              <ruby>
                東<rp>(</rp>
                <rt>トン</rt>
                <rp>)</rp>
              </ruby>
            </label>
          </li>
          <li className="mb-2">
            <label className="align-middle">
              <Radio name="menFon" value="2z" />
              <ruby>
                南<rp>(</rp>
                <rt>トン</rt>
                <rp>)</rp>
              </ruby>
            </label>
          </li>
          <li className="mb-2">
            <label className="align-middle">
              <Radio name="menFon" value="3z" />
              <ruby>
                西<rp>(</rp>
                <rt>シャー</rt>
                <rp>)</rp>
              </ruby>
            </label>
          </li>
          <li className="mb-2">
            <label className="align-middle">
              <Radio name="menFon" value="4z" />
              <ruby>
                北<rp>(</rp>
                <rt>ぺー</rt>
                <rp>)</rp>
              </ruby>
            </label>
          </li>
        </ul>

        <h2 className="font-bold mt-4 text-xl">本場（連荘）</h2>
        <ul className="grid grid-cols-4">
          <li className="mb-2">
            <label className="align-middle">
              <Radio name="honba" value="0" defaultChecked />0
            </label>
          </li>
          <li className="mb-2">
            <label className="align-middle">
              <Radio name="honba" value="1" />1
            </label>
          </li>
          <li className="mb-2">
            <label className="align-middle">
              <Radio name="honba" value="2" />2
            </label>
          </li>
          <li className="mb-2">
            <label className="align-middle">
              <Radio name="honba" value="3" />3
            </label>
          </li>
          <li className="mb-2">
            <label className="align-middle">
              <Radio name="honba" value="4" />4
            </label>
          </li>
          <li className="mb-2">
            <label className="align-middle">
              <Radio name="honba" value="5" />5
            </label>
          </li>
          <li className="mb-2">
            <label className="align-middle">
              <Radio name="honba" value="6" />6
            </label>
          </li>
          <li className="mb-2">
            <label className="align-middle">
              <Radio name="honba" value="7" />7
            </label>
          </li>
          <li className="mb-2">
            <label className="align-middle">
              <Radio name="honba" value="8" />8
            </label>
          </li>
        </ul>

        <h2 className="font-bold mt-4 text-xl">手動入力役</h2>
        <p>
          一部入力された牌からだけでは役を判定できないため、入力の必要があります
        </p>

        <h3 className="font-bold mt-4">リーチ関連</h3>
        <ul className="grid grid-cols-2">
          <li className="mb-2">
            <label className="align-middle">
              <CheckBox name="yaku[]" value={Riichi.name} />
              リーチ
            </label>
          </li>
          <li className="mb-2">
            <label className="align-middle">
              <CheckBox name="yaku[]" value={DoubleRiichi.name} />
              ダブルリーチ
            </label>
          </li>
          <li className="mb-2">
            <label className="align-middle">
              <CheckBox name="yaku[]" value={OpenRiichi.name} />
              オープンリーチ
            </label>
          </li>
          <li className="mb-2">
            <label className="align-middle">
              <CheckBox name="yaku[]" value={Ippatsu.name} />
              <ruby>
                一発
                <rp>(</rp>
                <rt>イッパツ</rt>
                <rp>)</rp>
              </ruby>
            </label>
          </li>
        </ul>

        <h3 className="font-bold mt-4">奇跡</h3>
        <ul className="grid grid-cols-2">
          <li className="mb-2">
            <label className="align-middle">
              <CheckBox name="yaku[]" value={Haitei.name} />
              <ruby>
                海底摸月
                <rp>(</rp>
                <rt>ハイテイツモ</rt>
                <rp>)</rp>
              </ruby>
            </label>
          </li>
          <li className="mb-2">
            <label className="align-middle">
              <CheckBox name="yaku[]" value={Houtei.name} />
              <ruby>
                河底撈魚
                <rp>(</rp>
                <rt>ホウテイロン</rt>
                <rp>)</rp>
              </ruby>
            </label>
          </li>
          <li className="mb-2">
            <label className="align-middle">
              <CheckBox name="yaku[]" value={RinshanKaihou.name} />
              <ruby>
                嶺上開花
                <rp>(</rp>
                <rt>リンシャンカイホウ</rt>
                <rp>)</rp>
              </ruby>
            </label>
          </li>
          <li className="mb-2">
            <label className="align-middle">
              <CheckBox name="yaku[]" value={ChanKan.name} />
              <ruby>
                槍槓
                <rp>(</rp>
                <rt>チャンカン</rt>
                <rp>)</rp>
              </ruby>
            </label>
          </li>
        </ul>

        <h3 className="font-bold mt-4">役満 / ダブル役満</h3>
        <ul className="grid grid-cols-2">
          <li className="mb-2">
            <label className="align-middle">
              <CheckBox name="yaku[]" value={Tenho.name} />
              <ruby>
                天和
                <rp>(</rp>
                <rt>テンホウ</rt>
                <rp>)</rp>
              </ruby>
            </label>
          </li>
          <li className="mb-2">
            <label className="align-middle">
              <CheckBox name="yaku[]" value={Chiho.name} />
              <ruby>
                地和
                <rp>(</rp>
                <rt>チーホウ</rt>
                <rp>)</rp>
              </ruby>
            </label>
          </li>
          <li className="mb-2">
            <label className="align-middle">
              <CheckBox name="yaku[]" value={JunseiChurenPoutou.name} />
              <ruby>
                純正九蓮宝燈
                <rp>(</rp>
                <rt>ジュンセイチュウレンポウトウ</rt>
                <rp>)</rp>
              </ruby>
            </label>
          </li>
          <li className="mb-2">
            <label className="align-middle">
              <CheckBox name="yaku[]" value={KokushiMusou13MenMachi.name} />
              <ruby>
                国士無双13面待ち
                <rp>(</rp>
                <rt>コクシムソウジュウサンメンマチ</rt>
                <rp>)</rp>
              </ruby>
            </label>
          </li>
        </ul>

        <h3 className="font-bold mt-4 text-xl">その他</h3>
        <ul className="grid grid-cols-2">
          <li className="mb-2">
            <label className="align-middle">
              <CheckBox name="yaku[]" value={NagashiMangan.name} />
              <ruby>
                流し満貫
                <rp>(</rp>
                <rt>ながしまんがん</rt>
                <rp>)</rp>
              </ruby>
            </label>
          </li>
        </ul>
      </div>
      <div className="dialog-footer mt-2 mb-3 ml-3 mr-3">
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            className="button primary-button outline-button w-full"
            onClick={() => setDialog?.({ open: false })}
          >
            戻る
          </button>

          <button
            type="button"
            className="button primary-button w-full"
            onClick={doSelectDora}
          >
            詳細設定へ（ドラ等）
          </button>
        </div>
        <hr className="mt-2 mb-2" />
        <button
          type="button"
          className="button primary-button w-full"
          onClick={doCalculate}
        >
          このまま計算する
        </button>
      </div>
    </div>
  );
};

export default DialogScoreCalculation;
