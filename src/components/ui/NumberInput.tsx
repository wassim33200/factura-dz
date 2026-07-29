'use client';

import React, { useState, useEffect } from 'react';

interface NumberInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  value: number;
  onChange: (val: number) => void;
}

export const NumberInput: React.FC<NumberInputProps> = ({
  value,
  onChange,
  onFocus,
  onBlur,
  className,
  step = 'any',
  ...props
}) => {
  const [strVal, setStrVal] = useState<string>(value === 0 ? '0' : String(value));
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (!isFocused) {
      setStrVal(value === 0 ? '0' : String(value));
    }
  }, [value, isFocused]);

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    e.target.select();
    if (onFocus) onFocus(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    const parsed = parseFloat(strVal);
    const finalVal = isNaN(parsed) ? 0 : parsed;
    onChange(finalVal);
    setStrVal(finalVal === 0 ? '0' : String(finalVal));
    if (onBlur) onBlur(e);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setStrVal(raw);
    if (raw === '' || raw === '-') {
      onChange(0);
    } else {
      const parsed = parseFloat(raw);
      if (!isNaN(parsed)) {
        onChange(parsed);
      }
    }
  };

  const displayValue = isFocused && strVal === '0' ? '' : strVal;

  return (
    <input
      {...props}
      type="number"
      step={step}
      value={displayValue}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onChange={handleChange}
      className={className}
    />
  );
};
