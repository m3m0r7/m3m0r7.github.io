import React, { useContext } from "react";
import DialogContext, { DialogType } from "../../Context/DialogContext";
import ScoreDataContext from "../../Context/ScoreDataContext";
import MahjongScoreArea from "../MahjongScoreArea";
import OptionContext from "../../Context/OptionContext";
import { PaiFormat } from "../../../@types/types";
import { createURL } from "../../Option";
import I18n from "../../../Lang/I18n";

const name: DialogType["openType"] = "score-detail";

const DialogScoreDetails = () => {
  const [dialog, setDialog] = useContext(DialogContext);
  const [option] = useContext(OptionContext);
  const [scoreData] = useContext(ScoreDataContext);

  if (!dialog?.open || name !== dialog?.openType) {
    return null;
  }

  const roundedUpFu =
    (scoreData?.fu ?? 0) -
    (scoreData?.appliedFuList.map((fu) => fu.isFu && fu.score).sum() ?? 0);

  const especiallyPaiPronunciation = {
    '1z': '東',
    '2z': '南',
    '3z': '西',
    '4z': '北',
    '5z': '白',
    '6z': '發',
    '7z': '中',
  }

  return (
    <div className="dialog">
      <div className="dialog-title">点数計算の詳細</div>
      <div className="dialog-contents">
        <h2 className="font-bold text-xl">サマリ</h2>
        <MahjongScoreArea/>

        <h2 className="font-bold mt-4 text-xl">条件</h2>
        <ul>
          <li className="grid grid-cols-2">
            <div>親</div>
            <div>{option?.jikaze === "1z" ? "はい" : "いいえ"}</div>
            <div>和了</div>
            <div>{option?.hora?.fromTsumo ? "門前清自摸和" : "ロン"}</div>
            <div>本場</div>
            <div>{option?.honba ?? 0} 本場 ({(option?.honba ?? 0) * (option?.localRules?.honba ?? 0)} 点)</div>
          </li>
        </ul>

        <h2 className="font-bold mt-4 text-xl">点数</h2>
        <ul>
          <li className="grid grid-cols-2">
            <div>点数</div>
            <div>{scoreData?.score.base}</div>
          </li>
          {scoreData?.score.parent && <li className="grid grid-cols-2">
            <div>親の支払い</div>
            <div>{scoreData?.score.parent}</div>
          </li>}

          {scoreData?.score.child && <li className="grid grid-cols-2">
            <div>子の支払い</div>
            <div>{scoreData?.score.child}</div>
          </li>
          }
        </ul>

        {(scoreData?.appliedFuList.length ?? 0) > 0 && <>
          <h2 className="font-bold mt-4 text-xl">
            <ruby>
              加符
              <rp>(</rp>
              <rt>かふ</rt>
              <rp>)</rp>
            </ruby>
          </h2>
          <ul>

            {scoreData?.appliedFuList.map(
              (fu, key) =>
                fu.isFu && (
                  <li key={key} className="grid grid-cols-2">
                    <div>{fu.name}</div>
                    <div>+{fu.score}</div>
                  </li>
                ),
            )}
            {roundedUpFu > 0 ? (
              <li className="grid grid-cols-2">
                <div>切り上げ</div>
                <div>+{roundedUpFu}</div>
              </li>
            ) : null}
          </ul>
        </>}

        <h2 className="font-bold mt-4 text-xl">
          <ruby>
            翻
            <rp>(</rp>
            <rt>はん</rt>
            <rp>)</rp>
          </ruby>
        </h2>
        <ul>
          {scoreData?.appliedYakuList.map(
            (yaku, key) =>
              ! yaku.isFu && (
                <li key={key} className="grid grid-cols-2">
                  <div>{yaku.name}</div>
                  {yaku.isYakuman && <div>役満</div>}
                  {yaku.isDoubleYakuman && <div>ダブル役満</div>}
                  {! yaku.isYakuman && ! yaku.isDoubleYakuman && (
                    <div>+{yaku.score}</div>
                  )}
                </li>
              ),
          )}
        </ul>

        <h2 className="font-bold mt-4 text-xl">
          成立した<ruby>
            面子
            <rp>(</rp>
            <rt>メンツ</rt>
            <rp>)</rp>
          </ruby>
        </h2>
        <ul className="grid grid-cols-1 gap-2">
          <li className="grid grid-cols-12 items-center gap-4">
            <div className="col-span-2 text-center">
              <span className="font-bold">面子名</span>
            </div>
            <div className="col-span-6 text-center">
              <span className="font-bold">牌の読み方</span>
            </div>
            <div className="col-span-4 text-center">
              <span className="font-bold">面子</span>
            </div>
          </li>
          {scoreData?.paiPatterns.map((paiPair, key) =>
            <li key={key} className="grid grid-cols-12 items-center gap-4">
              <div className="col-span-2">
                {paiPair.isKokushi && <ruby>
                  国士無双
                  <rp>(</rp>
                  <rt>コクシムソウ</rt>
                  <rp>)</rp>
                </ruby>}
                {paiPair.isChuren && <ruby>
                  九蓮宝燈
                  <rp>(</rp>
                  <rt>チュウレンポウトウ</rt>
                  <rp>)</rp>
                </ruby>}
                {! paiPair.isJantou && paiPair.isToitsu && <ruby>
                  対子
                  <rp>(</rp>
                  <rt>トイツ</rt>
                  <rp>)</rp>
                </ruby>}
                {paiPair.isKoutsu && <ruby>
                  刻子
                  <rp>(</rp>
                  <rt>コーツ</rt>
                  <rp>)</rp>
                </ruby>}
                {paiPair.isShuntsu && <ruby>
                  順子
                  <rp>(</rp>
                  <rt>シュンツ</rt>
                  <rp>)</rp>
                </ruby>}
                {paiPair.isJantou && <ruby>
                  雀頭
                  <rp>(</rp>
                  <rt>アタマ</rt>
                  <rp>)</rp>
                </ruby>}
              </div>
              <div className="col-span-6 grid grid-cols-3 gap-2">
                {paiPair.pattern.map((pai, key2) => <div key={`${key}_${key2}`} className="text-center">
                  {especiallyPaiPronunciation[pai.pai] && <ruby>
                    {especiallyPaiPronunciation[pai.pai]}
                    <rp>(</rp>
                    <rt>{I18n.ja.pronunciation.group[especiallyPaiPronunciation[pai.pai]]}</rt>
                    <rp>)</rp>
                  </ruby>}
                  {pai.group !== '字牌' && pai.group !== '三元牌' && <>
                    <ruby>
                      {pai.name}
                      <rp>(</rp>
                      <rt>{I18n.ja.pronunciation.number[pai.name]}</rt>
                      <rp>)</rp>
                    </ruby>
                    <ruby>
                      {pai.group}
                      <rp>(</rp>
                      <rt>{I18n.ja.pronunciation.group[pai.group]}</rt>
                      <rp>)</rp>
                    </ruby>

                  </>}
                </div>)}
              </div>
              <div className="col-span-4 grid grid-cols-3 gap-2">
                {paiPair.pattern.map((pai, key2) => <div key={`${key}_${key2}`}>
                  <img
                    src={createURL(`images/pai/${pai.pai}.png`)}
                    width="100%"
                  />
                </div>)}
              </div>
            </li>
          )}
        </ul>
      </div>
      <div className="dialog-footer mt-2 mb-3 grid gap-2 ml-3 mr-3">
        <button
          type="button"
          onClick={() => setDialog?.({ open: false })}
          className="button primary-button outline-button"
        >
          閉じる
        </button>
      </div>
    </div>
  );
};

export default DialogScoreDetails;
