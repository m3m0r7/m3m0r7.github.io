import React, { useContext, useEffect } from "react";
import DialogContext from "../Context/DialogContext";

const KeyboardShortcutHelp = () => {
  const [dialog, setDialog] = useContext(DialogContext);

  useEffect(() => {
    const event = (e: KeyboardEvent) => {
      if (e.key !== '?') {
        return
      }

      setDialog?.({
        open: true,
        openType: "help",
      });
    }

    document.addEventListener('keyup', event)

    return () => {
      document.removeEventListener('keyup', event)
    }
  }, [dialog]);

  return <></>
}

export default KeyboardShortcutHelp
