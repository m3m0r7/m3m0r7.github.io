import React, { useContext } from "react";
import DialogContext, { DialogType } from "../../Context/DialogContext";
import ScoreDataContext from "../../Context/ScoreDataContext";
import MahjongScoreArea from "../MahjongScoreArea";
import OptionContext from "../../Context/OptionContext";
import {
  PaiFormat,
  PaiKazeName,
  PaiName,
  PaiSangenName,
} from "../../../@types/types";
import { createURL } from "../../Option";
import I18n from "../../../Lang/I18n";
import SystemOptionContext from "../../Context/SystemOptionContext";

const name: DialogType["openType"] = "score-detail";

const DialogScoreDetails = () => {
  const [dialog, setDialog] = useContext(DialogContext);
  const [option] = useContext(OptionContext);
  const [systemOption] = useContext(SystemOptionContext);
  const [scoreData] = useContext(ScoreDataContext);

  if (!dialog?.open || name !== dialog?.openType) {
    return null;
  }

  const roundedUpFu =
    (scoreData?.fu ?? 0) -
    (scoreData?.appliedFuList.map((fu) => fu.isFu && fu.score).sum() ?? 0);

  const especiallyPaiPronunciation = {
    "1z": "東",
    "2z": "南",
    "3z": "西",
    "4z": "北",
    "5z": "白",
    "6z": "發",
    "7z": "中",
  } as Record<PaiName, string>;

  const coloredBarForAutomaticJantaku = {
    "10000": (
      <div
        className="automatic-jantaku-bar"
        style={{ backgroundColor: "#C81119" }}
      ></div>
    ),
    "5000": (
      <div
        className="automatic-jantaku-bar"
        style={{ backgroundColor: "#FFD300" }}
      ></div>
    ),
    "1000": (
      <div
        className="automatic-jantaku-bar"
        style={{ backgroundColor: "#0085CF" }}
      ></div>
    ),
    "500": (
      <div
        className="automatic-jantaku-bar"
        style={{ backgroundColor: "#4CA731" }}
      ></div>
    ),
    "100": <div className="automatic-jantaku-bar"></div>,
  };

  const calculateTransitionScoreBars = (score: number): [number, number][] => {
    const scoreBars: Record<string, number> = {
      "10000": 0,
      "5000": 0,
      "1000": 0,
      ...(systemOption?.with500ScoreBar ? { "500": 0 } : {}),
      "100": 0,
    };

    let remainingScore = score;
    Object.keys(scoreBars)
      .sort((a, b) => Number(b) - Number(a))
      .forEach((number) => {
        const count = Math.floor(remainingScore / Number(number));
        scoreBars[number] = count;
        remainingScore -= count * Number(number);
      });

    return Object.keys(scoreBars)
      .sort((a, b) => Number(b) - Number(a))
      .map((number) => [Number(number), scoreBars[number]]);
  };

  return (
    <div className="dialog">
      <div className="dialog-title">点数計算の詳細</div>
      <div className="dialog-contents">
        <h2 className="font-bold text-xl">サマリ</h2>
        <MahjongScoreArea />

        <h2 className="font-bold mt-4 text-xl">アガリ条件</h2>
        <ul>
          <li className="grid grid-cols-2">
            <div>親</div>
            <div>{option?.jikaze === "1z" ? "はい" : "いいえ"}</div>
            <div>和了</div>
            <div>{option?.hora?.fromTsumo ? "門前清自摸和" : "ロン"}</div>
            <div>本場</div>
            <div>
              {option?.honba ?? 0} 本場 (
              {(option?.honba ?? 0) * (option?.localRules?.honba ?? 0)} 点)
            </div>
          </li>
        </ul>

        {(scoreData?.appliedFuList.length ?? 0) > 0 && (
          <>
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
                      <div>
                        <ruby>
                          {fu.name}
                          <rp>(</rp>
                          <rt>
                            {I18n.ja.pronunciation.fu[
                              fu.name as keyof typeof I18n.ja.pronunciation.fu
                            ] ?? ""}
                          </rt>
                          <rp>)</rp>
                        </ruby>
                      </div>
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
          </>
        )}

        <h2 className="font-bold mt-4 text-xl">
          <ruby>
            翻<rp>(</rp>
            <rt>はん</rt>
            <rp>)</rp>
          </ruby>
        </h2>
        <ul>
          {scoreData?.appliedYakuList.map(
            (yaku, key) =>
              !yaku.isFu && (
                <li key={key} className="grid grid-cols-2">
                  <div>
                    <ruby>
                      {yaku.name}
                      <rp>(</rp>
                      <rt>
                        {I18n.ja.pronunciation.yaku[
                          yaku.name as keyof typeof I18n.ja.pronunciation.yaku
                        ] ?? ""}
                      </rt>
                      <rp>)</rp>
                    </ruby>
                  </div>
                  {yaku.isYakuman && <div>役満</div>}
                  {yaku.isDoubleYakuman && <div>ダブル役満</div>}
                  {!yaku.isYakuman && !yaku.isDoubleYakuman && (
                    <div>+{yaku.score}</div>
                  )}
                </li>
              ),
          )}
        </ul>

        <h2 className="font-bold mt-4 text-xl">点数</h2>
        <ul>
          <li className="grid grid-cols-2">
            <div>点数</div>
            <div>{scoreData?.score.base}</div>
          </li>
          {scoreData?.score.parent && (
            <li className="grid grid-cols-2">
              <div>親の支払い</div>
              <div>{scoreData?.score.parent}</div>
            </li>
          )}

          {scoreData?.score.child && (
            <li className="grid grid-cols-2">
              <div>子の支払い</div>
              <div>{scoreData?.score.child}</div>
            </li>
          )}
        </ul>
        <h2 className="font-bold mt-4 text-xl">点棒移動</h2>
        <div className="grid grid-cols-1 gap-3">
          {!scoreData?.score.child && !scoreData?.score.parent && (
            <div>
              <h2 className="font-bold mb-2">ロン相手</h2>
              <ul>
                {calculateTransitionScoreBars(scoreData?.score.base ?? 0).map(
                  ([name, count]) => (
                    <li
                      className={`grid items-center grid-cols-6 ${count === 0 ? "opacity-30" : ""}`}
                    >
                      <div className="col-span-2 place-self-center">
                        <img src={createURL(`images/bar/${name}.png`)} />
                        <p className="text-xs text-center">OR</p>
                        {
                          coloredBarForAutomaticJantaku[
                            name as unknown as keyof typeof coloredBarForAutomaticJantaku
                          ]
                        }
                      </div>
                      <div className="col-span-2 text-center">{name}点棒</div>
                      <div className="col-span-1">{count} 本</div>
                    </li>
                  ),
                )}
              </ul>
            </div>
          )}

          {scoreData?.score.parent && (
            <div>
              <h2 className="font-bold mb-2">親</h2>
              <ul className="grid grid-cols-1 gap-3">
                {calculateTransitionScoreBars(scoreData?.score.parent ?? 0).map(
                  ([name, count]) => (
                    <li
                      className={`grid items-center grid-cols-6 ${count === 0 ? "opacity-30" : ""}`}
                    >
                      <div className="col-span-2 place-self-center">
                        <img src={createURL(`images/bar/${name}.png`)} />
                        <p className="text-xs text-center">OR</p>
                        {
                          coloredBarForAutomaticJantaku[
                            name as unknown as keyof typeof coloredBarForAutomaticJantaku
                          ]
                        }
                      </div>
                      <div className="col-span-2 text-center">{name}点棒</div>
                      <div className="col-span-1">{count} 本</div>
                    </li>
                  ),
                )}
              </ul>
            </div>
          )}

          {scoreData?.score.child && (
            <div>
              <h2 className="font-bold mb-2">子</h2>
              <ul className="grid grid-cols-1 score-bar-description--layout">
                {calculateTransitionScoreBars(scoreData?.score.child ?? 0).map(
                  ([name, count]) => (
                    <li
                      className={`grid items-center grid-cols-6 ${count === 0 ? "opacity-30" : ""}`}
                    >
                      <div className="col-span-2 place-self-center">
                        <img src={createURL(`images/bar/${name}.png`)} />
                        <p className="text-xs text-center">OR</p>
                        {
                          coloredBarForAutomaticJantaku[
                            name as unknown as keyof typeof coloredBarForAutomaticJantaku
                          ]
                        }
                      </div>
                      <div className="col-span-2 text-center">{name}点棒</div>
                      <div className="col-span-1">{count} 本</div>
                    </li>
                  ),
                )}
              </ul>
            </div>
          )}
        </div>
        <p className="mt-2" style={{ fontSize: "10px" }}>
          ※ 点棒の色は自動雀卓（AMOS）をベースにしています。
        </p>

        <h2 className="font-bold mt-4 text-xl">
          成立した
          <ruby>
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
          {scoreData?.paiPatterns.map((paiPair, key) => (
            <li key={key} className="grid grid-cols-12 items-center gap-4">
              <div className="col-span-2">
                {paiPair.isKokushi && (
                  <ruby>
                    国士無双
                    <rp>(</rp>
                    <rt>コクシムソウ</rt>
                    <rp>)</rp>
                  </ruby>
                )}
                {paiPair.isChuren && (
                  <ruby>
                    九蓮宝燈
                    <rp>(</rp>
                    <rt>チュウレンポウトウ</rt>
                    <rp>)</rp>
                  </ruby>
                )}
                {!paiPair.isJantou && paiPair.isToitsu && (
                  <ruby>
                    対子
                    <rp>(</rp>
                    <rt>トイツ</rt>
                    <rp>)</rp>
                  </ruby>
                )}
                {paiPair.isKoutsu && (
                  <ruby>
                    刻子
                    <rp>(</rp>
                    <rt>コーツ</rt>
                    <rp>)</rp>
                  </ruby>
                )}
                {paiPair.isShuntsu && (
                  <ruby>
                    順子
                    <rp>(</rp>
                    <rt>シュンツ</rt>
                    <rp>)</rp>
                  </ruby>
                )}
                {paiPair.isJantou && (
                  <ruby>
                    雀頭
                    <rp>(</rp>
                    <rt>アタマ</rt>
                    <rp>)</rp>
                  </ruby>
                )}
              </div>
              <div className="col-span-6 grid grid-cols-3 gap-2">
                {paiPair.pattern.map((pai, key2) => (
                  <div key={`${key}_${key2}`} className="text-center">
                    {especiallyPaiPronunciation[pai.pai] && (
                      <ruby>
                        {especiallyPaiPronunciation[pai.pai]}
                        <rp>(</rp>
                        <rt>
                          {
                            I18n.ja.pronunciation.group[
                              especiallyPaiPronunciation[
                                pai.pai
                              ] as keyof (typeof I18n)["ja"]["pronunciation"]["group"]
                            ]
                          }
                        </rt>
                        <rp>)</rp>
                      </ruby>
                    )}
                    {pai.group !== "字牌" && pai.group !== "三元牌" && (
                      <>
                        <ruby>
                          {pai.name}
                          {pai.group}
                          <rp>(</rp>
                          <rt>
                            {
                              I18n.ja.pronunciation.number[
                                pai.name as keyof (typeof I18n)["ja"]["pronunciation"]["number"]
                              ]
                            }
                            {
                              I18n.ja.pronunciation.group[
                                pai.group as keyof (typeof I18n)["ja"]["pronunciation"]["group"]
                              ]
                            }
                          </rt>
                          <rp>)</rp>
                        </ruby>
                      </>
                    )}
                  </div>
                ))}
              </div>
              <div className="col-span-4 grid grid-cols-3 gap-2">
                {paiPair.pattern.map((pai, key2) => (
                  <div
                    key={`${key}_${key2}`}
                    className={pai.fromFuro ? "pai-selections--pai--furo" : ""}
                  >
                    <img
                      src={createURL(
                        `images/pai/${pai.pai}${pai.isAkaDora ? "a" : ""}.png`,
                      )}
                      width="100%"
                    />
                  </div>
                ))}
              </div>
            </li>
          ))}
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
