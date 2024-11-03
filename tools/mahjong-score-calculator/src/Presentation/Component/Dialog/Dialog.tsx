import React, { useContext } from 'react';
import DialogOverlay from "./DialogOverlay";
import DialogSelectPai from "./DialogSelectPai";

import './dialog.css'
import DialogContext from "../../Context/DialogContext";
import DialogScoreCalculation from "./DialogScoreCalculation";
import DialogScoreDetails from "./DialogScoreDetails";
import DialogResetCalculation from "./DialogResetCalculation";

const Dialog = () => {
  const [dialog] = useContext(DialogContext)

  if (!dialog) {
    return null
  }
  return <DialogOverlay className={`${dialog.open ? '' : 'hidden'} flex items-center justify-center`}>
    <DialogSelectPai />
    <DialogScoreCalculation />
    <DialogScoreDetails />
    <DialogResetCalculation />
  </DialogOverlay>
}

export default Dialog
