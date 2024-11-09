import React, { useContext } from "react";
import DialogContext, { DialogType } from "../../Context/DialogContext";
import PaiSelectionContext from "../../Context/PaiSelectionContext";
import OptionContext from "../../Context/OptionContext";
import {
  MahjongDefaultLocalRules,
  MahjongDefaultOption,
} from "../../../Runtime/MahjongDefaultOption";
import ScoreDataContext from "../../Context/ScoreDataContext";
import CalculationStepContext from "../../Context/CalculationStepContext";
import SystemOptionContext, {
  SystemDefaultOption,
} from "../../Context/SystemOptionContext";
import { scoreTable } from "../../../Runtime/Score/MahjongScore";
import { MahjongFourPlayerStyleScoreCalculator } from "../../../Runtime/Score/MahjongFourPlayerStyleScoreCalculator";
import { convertToNormalPai } from "../../../Utilities/Converter";
import { MahjongThreePlayerStyleScoreCalculator } from "../../../Runtime/Score/MahjongThreePlayerStyleScoreCalculator";

const name: DialogType["openType"] = "score-list-view";

const DialogScoreListView = () => {
  const [calculationStep, setCalculationStep] = useContext(
    CalculationStepContext,
  );
  const [dialog, setDialog] = useContext(DialogContext);
  if (!dialog || !setDialog || !dialog.open || name !== dialog.openType) {
    return null;
  }

  const fuList = [25, 30, 40, 50, 60, 70, 80, 90, 100, 110];

  const hanList = [1, 2, 3, 4];

  return (
    <div className="dialog">
      <div className="dialog-title">点数表</div>
      <div className="dialog-contents">
        <h2 className={`text-xl font-bold`}>四人麻雀</h2>
        {["parent", "child"].map((target, key) => (
          <div key={key}>
            <h2
              className={`text-lg font-bold ${target === "child" ? "mt-2" : ""}`}
            >
              {
                {
                  parent: "親",
                  child: "子",
                }[target]
              }
            </h2>
            <table className="w-full table-auto border border-collapse border-gray-300">
              <thead>
                <tr>
                  <th className="bg-gray-200"></th>
                  <th className="text-xs bg-gray-200 border border-gray-300">
                    1翻
                  </th>
                  <th className="text-xs bg-gray-200 border border-gray-300">
                    2翻
                  </th>
                  <th className="text-xs bg-gray-200 border border-gray-300">
                    3翻
                  </th>
                  <th className="text-xs bg-gray-200 border border-gray-300">
                    4翻
                  </th>
                </tr>
              </thead>
              <tbody>
                {fuList.map((fu, key1) => (
                  <tr key={key1}>
                    <th className="text-xs bg-gray-200 border border-gray-300">
                      {fu}符
                    </th>
                    {hanList.map((han, key2) => {
                      const score =
                        scoreTable[target as "parent" | "child"][han][fu] ?? 0;
                      const splitScore =
                        MahjongFourPlayerStyleScoreCalculator.calculateParentAndChildScore(
                          {
                            hora: {
                              pai: "1m",
                              fromTsumo: true,
                              fromRon: false,
                              fromRinshanPai: false,
                            },
                          },
                          score,
                          0,
                          target === "parent",
                        );

                      return (
                        <td
                          key={key2}
                          className="text-xs text-center border border-gray-300"
                        >
                          {score === 0 ? "-" : score}
                          {score > 0 && (
                            <>
                              {(splitScore.child || splitScore.parent) && (
                                <br />
                              )}
                              {splitScore.child &&
                                splitScore.parent &&
                                `(${splitScore.parent}/${splitScore.child})`}
                              {splitScore.child &&
                                !splitScore.parent &&
                                `(${splitScore.child}オール)`}
                            </>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}

        <h2 className={`text-xl font-bold mt-4`}>三人麻雀（ツモ損）</h2>
        {["parent", "child"].map((target, key) => (
          <div key={key}>
            <h2
              className={`text-lg font-bold ${target === "child" ? "mt-2" : ""}`}
            >
              {
                {
                  parent: "親",
                  child: "子",
                }[target]
              }
            </h2>
            <table className="w-full table-auto border border-collapse border-gray-300">
              <thead>
                <tr>
                  <th className="bg-gray-200"></th>
                  <th className="text-xs bg-gray-200 border border-gray-300">
                    1翻
                  </th>
                  <th className="text-xs bg-gray-200 border border-gray-300">
                    2翻
                  </th>
                  <th className="text-xs bg-gray-200 border border-gray-300">
                    3翻
                  </th>
                  <th className="text-xs bg-gray-200 border border-gray-300">
                    4翻
                  </th>
                </tr>
              </thead>
              <tbody>
                {fuList.map((fu, key1) => (
                  <tr key={key1}>
                    <th className="text-xs bg-gray-200 border border-gray-300">
                      {fu}符
                    </th>
                    {hanList.map((han, key2) => {
                      const score =
                        scoreTable[target as "parent" | "child"][han][fu] ?? 0;
                      const splitScore =
                        MahjongThreePlayerStyleScoreCalculator.calculateParentAndChildScore(
                          {
                            hora: {
                              pai: "1m",
                              fromTsumo: true,
                              fromRon: false,
                              fromRinshanPai: false,
                            },
                            localRules: {
                              ...MahjongDefaultLocalRules,
                              threePlayStyle: {
                                roundUpUnder1000: false,
                                scoring: "DISCOUNTED_TSUMO",
                              },
                            },
                          },
                          score,
                          0,
                          target === "parent",
                        );

                      return (
                        <td
                          key={key2}
                          className="text-xs text-center border border-gray-300"
                        >
                          {score === 0 ? "-" : score}
                          {score > 0 && (
                            <>
                              {(splitScore.child || splitScore.parent) && (
                                <br />
                              )}
                              {splitScore.child &&
                                splitScore.parent &&
                                `(${splitScore.parent}/${splitScore.child})`}
                              {splitScore.child &&
                                !splitScore.parent &&
                                `(${splitScore.child}オール)`}
                            </>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}

        <h2 className={`text-xl font-bold mt-4`}>三人麻雀（北家折半）</h2>
        {["parent", "child"].map((target, key) => (
          <div key={key}>
            <h2
              className={`text-lg font-bold ${target === "child" ? "mt-2" : ""}`}
            >
              {
                {
                  parent: "親",
                  child: "子",
                }[target]
              }
            </h2>
            <table className="w-full table-auto border border-collapse border-gray-300">
              <thead>
                <tr>
                  <th className="bg-gray-200"></th>
                  <th className="text-xs bg-gray-200 border border-gray-300">
                    1翻
                  </th>
                  <th className="text-xs bg-gray-200 border border-gray-300">
                    2翻
                  </th>
                  <th className="text-xs bg-gray-200 border border-gray-300">
                    3翻
                  </th>
                  <th className="text-xs bg-gray-200 border border-gray-300">
                    4翻
                  </th>
                </tr>
              </thead>
              <tbody>
                {fuList.map((fu, key1) => (
                  <tr key={key1}>
                    <th className="text-xs bg-gray-200 border border-gray-300">
                      {fu}符
                    </th>
                    {hanList.map((han, key2) => {
                      const score =
                        scoreTable[target as "parent" | "child"][han][fu] ?? 0;
                      const splitScore =
                        MahjongThreePlayerStyleScoreCalculator.calculateParentAndChildScore(
                          {
                            hora: {
                              pai: "1m",
                              fromTsumo: true,
                              fromRon: false,
                              fromRinshanPai: false,
                            },
                            localRules: {
                              ...MahjongDefaultLocalRules,
                              threePlayStyle: {
                                roundUpUnder1000: false,
                                scoring: "SPLIT",
                              },
                            },
                          },
                          score,
                          0,
                          target === "parent",
                        );

                      return (
                        <td
                          key={key2}
                          className="text-xs text-center border border-gray-300"
                        >
                          {score === 0 ? "-" : score}
                          {score > 0 && (
                            <>
                              {(splitScore.child || splitScore.parent) && (
                                <br />
                              )}
                              {splitScore.child &&
                                splitScore.parent &&
                                `(${splitScore.parent}/${splitScore.child})`}
                              {splitScore.child &&
                                !splitScore.parent &&
                                `(${splitScore.child}オール)`}
                            </>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
      <div className="dialog-footer mt-2 mb-3 ml-3 mr-3">
        <button
          type="button"
          className="button primary-button outline-button w-full"
          onClick={() => setDialog?.({ open: false })}
        >
          閉じる
        </button>
      </div>
    </div>
  );
};

export default DialogScoreListView;
