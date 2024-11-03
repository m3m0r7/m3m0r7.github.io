import React, { forwardRef, InputHTMLAttributes } from 'react';
import './input.css'

const Radio = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>((props, ref) => {
  return <input {...props} ref={ref} type="radio" />;
});

export default Radio;
