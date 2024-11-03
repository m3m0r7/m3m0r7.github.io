import React, { useContext } from 'react';
import DialogContext, { DialogType } from "../../Context/DialogContext";
import ScoreDataContext from "../../Context/ScoreDataContext";
import MahjongScoreArea from "../MahjongScoreArea";
import OptionContext from "../../Context/OptionContext";

const name: DialogType['openType'] = 'score-detail';

const DialogScoreDetails = () => {
  const [dialog, setDialog] = useContext(DialogContext)
  const [option] = useContext(OptionContext)
  const [scoreData] = useContext(ScoreDataContext)

  if (!dialog?.open || name !== dialog?.openType) {
    return null
  }

  const roundedUpFu = (scoreData?.fu ?? 0) - (scoreData?.appliedFuList.map(fu => fu.isFu && fu.score).sum() ?? 0)

  return <div className="dialog">
    <div className="dialog-title">
      点数計算の詳細
    </div>
    <div className="dialog-contents">
      <h2 className="font-bold text-xl">詳細</h2>
      <MahjongScoreArea/>

      <h2 className="font-bold mt-4 text-xl">条件</h2>
      <ul>
        <li className="grid grid-cols-2">
          <div>親</div>
          <div>{option?.jikaze === '1z' ? 'はい' : 'いいえ'}</div>
          <div>和了</div>
          <div>{option?.hora?.fromTsumo ? '門前清自摸和' : 'ロン'}</div>
          <div>本場</div>
          <div>{(option?.honba ?? 0) * (option?.localRules?.honba ?? 0)}</div>
        </li>
      </ul>

      <h2 className="font-bold mt-4 text-xl">
        <ruby>加符
          <rp>(</rp>
          <rt>かふ</rt>
          <rp>)</rp>
        </ruby>
      </h2>
      <ul>
        {scoreData?.appliedFuList.map((fu, key) => fu.isFu && <li key={key} className="grid grid-cols-2">
          <div>{fu.name}</div>
          <div>+{fu.score}</div>
        </li>)}
        {roundedUpFu > 0
          ? <li className="grid grid-cols-2">
              <div>切り上げ</div>
              <div>+{roundedUpFu}</div>
            </li>
          : null}
      </ul>

      <h2 className="font-bold mt-4 text-xl">
        <ruby>翻
          <rp>(</rp>
          <rt>はん</rt>
          <rp>)</rp>
        </ruby>
      </h2>
      <ul>
        {scoreData?.appliedYakuList.map((yaku, key) => ! yaku.isFu && <li key={key} className="grid grid-cols-2">
          <div>{yaku.name}</div>
          {yaku.isYakuman && <div>役満</div>}
          {yaku.isDoubleYakuman && <div>ダブル役満</div>}
          {! yaku.isYakuman && ! yaku.isDoubleYakuman && <div>+{yaku.score}</div>}
        </li>)}
      </ul>
    </div>
    <div className="dialog-footer mt-2 mb-3 grid gap-2 ml-3 mr-3">
      <button type="button" onClick={() => setDialog?.({ open: false })}
              className="button primary-button outline-button">
        閉じる
      </button>
    </div>
  </div>
}

export default DialogScoreDetails
