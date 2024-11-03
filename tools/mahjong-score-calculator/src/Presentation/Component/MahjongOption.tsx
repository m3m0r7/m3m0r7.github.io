import React, { useContext } from 'react';
import CheckBox from "./Form/CheckBox";
import Radio from "./Form/Radio";
import OptionContext from "../Context/OptionContext";

const MahjongOption = () => {
  const [ option, setOption ] = useContext(OptionContext)

  return <div>
    <h2 className="font-bold text-xl">ゲームの設定</h2>
    <ul>
      <li><label><Radio checked disabled/>四人麻雀</label></li>
      <li><label><Radio disabled/>三人麻雀（未実装）</label></li>
    </ul>

    <h2 className="font-bold mt-4 text-xl">一般的な設定</h2>
    <ul>
      <li><label><CheckBox defaultChecked={option?.localRules?.kuitan}/>喰いタン</label></li>
    </ul>

    <h2 className="font-bold mt-4 text-xl">連風牌の符</h2>
    <ul className="grid grid-cols-4">
      <li className="mb-2"><label className="align-middle"><Radio name="renFon" value="0"
                                                                  defaultChecked={option?.localRules?.fu.renfonPai === 0}/>符なし</label>
      </li>
      <li className="mb-2"><label className="align-middle"><Radio name="renFon" value="2"
                                                                  defaultChecked={option?.localRules?.fu.renfonPai === 2}/>2
        符</label>
      </li>
      <li className="mb-2"><label className="align-middle"><Radio name="renFon" value="4"
                                                                  defaultChecked={option?.localRules?.fu.renfonPai === 4}/>4
        符</label>
      </li>
    </ul>

    <p
      className="text-xs mt-4">※和了牌を選択しなかった場合は、一番最初の牌を和了牌とみなして計算します</p>

    <p
      className="text-xs mt-4 text-red-500">※一部のルールなどはまだ開発中です。普段打ってないやり方を逆に知らないのでプルリクエストお待ちしてます。</p>
  </div>
    ;
};

export default MahjongOption;
