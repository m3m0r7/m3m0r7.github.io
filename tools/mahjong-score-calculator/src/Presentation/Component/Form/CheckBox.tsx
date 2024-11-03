import React, { forwardRef, InputHTMLAttributes } from "react";
import "./input.css";

const CheckBox = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>((props, ref) => {
  return <input {...props} ref={ref} type="checkbox" />;
});

export default CheckBox;
