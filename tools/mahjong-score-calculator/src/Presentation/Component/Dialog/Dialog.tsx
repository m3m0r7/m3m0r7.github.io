import React, { useContext } from "react";
import DialogOverlay from "./DialogOverlay";

import "./dialog.css";
import DialogContext from "../../Context/DialogContext";
import DialogScoreCalculation from "./DialogScoreCalculation";
import DialogScoreDetails from "./DialogScoreDetails";
import DialogResetCalculation from "./DialogResetCalculation";
import DialogConfirmKan from "./DialogConfirmKan";
import DialogInputSupport from "./DialogInputSupport";
import DialogPeNuki from "./DialogPeNuki";
import DialogScoreListView from "./DialogScoreListView";
import DialogAttention from "./DialogAttention";

const Dialog = () => {
  const [dialog] = useContext(DialogContext);

  if (!dialog) {
    return null;
  }
  return (
    <DialogOverlay
      className={`${dialog.open ? "" : "hidden"} flex items-center justify-center`}
    >
      <DialogAttention />
      <DialogScoreListView />
      <DialogPeNuki />
      <DialogInputSupport />
      <DialogConfirmKan />
      <DialogScoreCalculation />
      <DialogScoreDetails />
      <DialogResetCalculation />
    </DialogOverlay>
  );
};

export default Dialog;
