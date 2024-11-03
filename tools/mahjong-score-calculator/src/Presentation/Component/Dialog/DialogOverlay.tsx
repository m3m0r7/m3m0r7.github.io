import React from 'react';

const DialogOverlay = ( props: { children: React.ReactNode, className?: string } ) => {
  return <div className={`${props.className ?? ''} dialog-overlay`}>
    {props.children}
  </div>
}

export default DialogOverlay
