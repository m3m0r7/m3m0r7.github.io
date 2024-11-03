import React, { useContext } from 'react';
import { PaiGroupName } from "../../@types/types";
import { createURL } from "../Option";
import PaiSelectionContext from "../Context/PaiSelectionContext";

const MahjongPaiSelections = () => {
  const [ _selections, setSelections ] = useContext(PaiSelectionContext);

  const selection = _selections ?? {
    paiList: [],
  }

  const removePai = (index: number) => {
    setSelections?.({
      paiList: selection.paiList.filter((selection, k) => k !== index),
    })
  }

  return <div>
    <ul className="grid grid-cols-8 gap-1 pai-selections">
      {selection.paiList.map((v, k) => <li key={k} onClick={() => removePai(k)} className="pai-selection-text flex w-full items-center justify-center">
        <div className="pai-selections--pai" style={{ backgroundImage: `url(${createURL(`images/pai/${v.pai}.png`)})` }}>
        </div>
      </li>)}
      {Array.from({ length: 14 - selection.paiList.length }, (_, k) => k)
        .map(((k) => <li key={k} className="pai-selection-text flex w-full items-center justify-center"><div><div className="text-center">牌</div></div></li>))}
    </ul>
  </div>;
};

export default MahjongPaiSelections;
