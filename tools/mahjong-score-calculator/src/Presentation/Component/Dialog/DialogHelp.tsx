import React, { useContext } from "react";
import DialogContext, { DialogType } from "../../Context/DialogContext";

const name: DialogType["openType"] = "help";

const DialogHelp = () => {
  const [dialog, setDialog] = useContext(DialogContext);

  if (!dialog || !setDialog || !dialog.open || name !== dialog.openType) {
    return null;
  }

  return (
    <div className="dialog dialog-help">
      <div className="dialog-title">ヘルプ</div>
      <div className="dialog-contents">
        <h2>キーボードショートカット</h2>
        <p>本ツールは入力を円滑にするためにキーボードショートカットを提供しています。</p>
        <p><code>[モード]</code><code>[数字]</code><code>[グループ]</code>の順番に入力することでキーボードのみで牌を指定することができます。</p>
        <p>例えば二筒（リャンピン）を指定したい場合は <code>2</code> <code>p</code>、五萬（ウーワン）の赤ドラを指定したい場合は <code>a</code> <code>5</code> <code>m</code> の順に入力します。</p>
        <h3 className="mt-4">モード</h3>
        <table className="w-full border-collapse border border-gray-500">
          <thead>
          <tr>
            <th className="border border-gray-500" style={{ width: "64px" }}>キー</th>
            <th className="border border-gray-500">説明</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td className="text-center border border-gray-500"><code>a</code></td>
            <td className="border border-gray-500">赤ドラ指定（数字が 5 のみ適用）。既に指定されている場合は無効となります。</td>
          </tr>
          <tr>
            <td className="text-center border border-gray-500"><code>h</code></td>
            <td className="border border-gray-500">和了（アガリ）牌の指定。既に指定されている場合は新しく指定した牌が和了牌となります。</td>
          </tr>
          <tr>
            <td className="text-center border border-gray-500"><code>d</code></td>
            <td className="border border-gray-500">ドラ牌の指定。</td>
          </tr>
          <tr>
            <td className="text-center border border-gray-500"><code>u</code></td>
            <td className="border border-gray-500">裏ドラ牌の指定。</td>
          </tr>
          <tr>
            <td className="text-center border border-gray-500"><code>f</code></td>
            <td className="border border-gray-500">副露（鳴き）牌の指定。</td>
          </tr>
          <tr>
            <td className="text-center border border-gray-500"><code>c</code></td>
            <td className="border border-gray-500">槓子（カンツ）牌の指定。指定した数字を 4
              つ入力し、槓子扱いとします。既に同じ牌がいくつか選ばれている場合、または選べる牌が最大となった場合は一部スキップされます。
            </td>
          </tr>
          <tr>
            <td className="text-center border border-gray-500"><code>k</code></td>
            <td className="border border-gray-500">刻子（コウツ）牌の指定。指定した数字を 3
              つ入力します。既に同じ牌がいくつか選ばれている場合、または選べる牌が最大となった場合は一部スキップされます。
            </td>
          </tr>
          <tr>
            <td className="text-center border border-gray-500"><code>s</code></td>
            <td className="border border-gray-500">入力した数字を起点に上方の順子（シュンツ）を入力します。例えば <code>s1p</code> と入力した場合は <code>1p</code><code>2p</code><code>3p</code> のように入力されます。選べる牌が最大となった場合は一部スキップされます。
            </td>
          </tr>
          </tbody>
        </table>
        <h3 className="mt-4">数字</h3>
        <p>数牌の場合は <strong>1〜9</strong>，字牌の場合は <strong>1〜7</strong> を指定してください。字牌は以下のようなマッピングです。</p>
        <table className="w-full border-collapse border border-gray-500">
          <thead>
          <tr>
            <th className="border border-gray-500" style={{ width: "64px" }}>番号</th>
            <th className="border border-gray-500">牌名</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td className="text-center border border-gray-500"><code>1</code></td>
            <td className="border border-gray-500">東</td>
          </tr>
          <tr>
            <td className="text-center border border-gray-500"><code>2</code></td>
            <td className="border border-gray-500">南</td>
          </tr>
          <tr>
            <td className="text-center border border-gray-500"><code>3</code></td>
            <td className="border border-gray-500">西</td>
          </tr>
          <tr>
            <td className="text-center border border-gray-500"><code>4</code></td>
            <td className="border border-gray-500">北</td>
          </tr>
          <tr>
            <td className="text-center border border-gray-500"><code>5</code></td>
            <td className="border border-gray-500">白</td>
          </tr>
          <tr>
            <td className="text-center border border-gray-500"><code>6</code></td>
            <td className="border border-gray-500">発</td>
          </tr>
          <tr>
            <td className="text-center border border-gray-500"><code>7</code></td>
            <td className="border border-gray-500">中</td>
          </tr>
          </tbody>
        </table>

        <h3 className="mt-4">グループ</h3>
        <table className="w-full border-collapse border border-gray-500">
          <thead>
          <tr>
            <th className="border border-gray-500" style={{ width: "64px" }}>キー</th>
            <th className="border border-gray-500">グループ</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td className="text-center border border-gray-500"><code>m</code></td>
            <td className="border border-gray-500">萬子（マンズ）</td>
          </tr>
          <tr>
            <td className="text-center border border-gray-500"><code>p</code></td>
            <td className="border border-gray-500">筒子（ピンズ）</td>
          </tr>
          <tr>
            <td className="text-center border border-gray-500"><code>s</code></td>
            <td className="border border-gray-500">索子（ソウズ）</td>
          </tr>
          <tr>
            <td className="text-center border border-gray-500"><code>z</code></td>
            <td className="border border-gray-500">字牌（ツーパイ）</td>
          </tr>
          </tbody>
        </table>
      </div>
      <div className="dialog-footer mt-2 mb-3 grid ml-3 mr-3">
        <button
          type="button"
          className="button primary-button outline-button"
          onClick={() => setDialog?.({ open: false })}
        >
          閉じる
        </button>
      </div>
    </div>
  );
};

export default DialogHelp;
