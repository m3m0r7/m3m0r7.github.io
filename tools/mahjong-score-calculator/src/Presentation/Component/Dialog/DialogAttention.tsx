import React, { useContext } from "react";
import DialogContext, { DialogType } from "../../Context/DialogContext";

const name: DialogType["openType"] = "attention";

const DialogAttention = () => {
  const [dialog, setDialog] = useContext(DialogContext);

  if (!dialog || !setDialog || !dialog.open || name !== dialog.openType) {
    return null;
  }

  return (
    <div className="dialog">
      <div className="dialog-title">当サイトにおける注意事項</div>
      <div className="dialog-message">
        <h2>本ツールについて</h2>
        <p>
          このツールは <a href="https://x.com/m3m0r7">@m3m0r7</a>{" "}
          によって個人開発されたものです。本ツールを利用して生じた如何なる問題の責任は一切負いません。不具合や追加要望などは
          <a href="https://github.com/m3m0r7/m3m0r7.github.io">GitHub</a>{" "}
          よりご依頼またはプルリクエストください。
        </p>

        <h2>Cookie</h2>
        <p>
          当サイトでは、サイトの利便性向上を目的に Cookie
          を使用しています。当サイトをご利用いただくことで Cookie
          の利用を同意したものとみなします。
        </p>
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

export default DialogAttention;
