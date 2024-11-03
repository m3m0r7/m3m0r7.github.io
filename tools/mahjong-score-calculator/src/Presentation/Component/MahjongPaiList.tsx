import React from "react";
import { PaiGroupName } from "../../@types/types";
import MahjongPai from "./MahjongPai";

const MahjongPaiList = (props: { type: PaiGroupName }) => {
  return (
    <div className="grid grid-cols-8 gap-1 items-start w-full">
      {Array.from({ length: props.type === "z" ? 7 : 9 }, (_, k) => k).map(
        (number) =>
          Array.from({ length: 4 }, (_, k) => k).map((k) => (
            <MahjongPai
              key={number + 1 + "_" + k}
              index={k}
              number={number + 1}
              type={props.type}
            />
          )),
      )}
    </div>
  );
};

export default MahjongPaiList;
