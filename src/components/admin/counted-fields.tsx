"use client";

import { useState, type ChangeEvent } from "react";

export function CountedInput({
  defaultValue,
  maxLength,
  name,
  className = "field",
  warningThreshold = Math.floor(maxLength * 0.8),
  ...rest
}: {
  defaultValue?: string | null;
  maxLength: number;
  name: string;
  className?: string;
  warningThreshold?: number;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  const [value, setValue] = useState(defaultValue ?? "");
  const len = value.length;
  const remaining = maxLength - len;
  const isWarning = len >= warningThreshold && len < maxLength;
  const isLimit = len >= maxLength;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    if (rest.onChange) rest.onChange(e);
  };

  return (
    <div className="space-y-1">
      <input
        {...rest}
        className={`${className} ${isLimit ? "border-red-500 focus:border-red-600" : isWarning ? "border-amber-500 focus:border-amber-600" : ""}`}
        defaultValue={undefined}
        maxLength={maxLength}
        name={name}
        onChange={handleChange}
        value={value}
      />
      <div className="flex justify-between items-center text-xs">
        <span
          className={
            isLimit
              ? "font-bold text-red-600"
              : isWarning
                ? "font-semibold text-amber-600"
                : "text-stone-400"
          }
        >
          {isLimit
            ? "Достигнут максимум символов!"
            : isWarning
              ? `Осталось мало символов: ${remaining}`
              : `Осталось: ${remaining}`}
        </span>
        <span
          className={`font-mono ${isLimit ? "font-bold text-red-600" : isWarning ? "font-semibold text-amber-600" : "text-stone-400"}`}
        >
          {len} / {maxLength}
        </span>
      </div>
    </div>
  );
}

export function CountedTextarea({
  defaultValue,
  maxLength,
  name,
  className = "field min-h-20",
  warningThreshold = Math.floor(maxLength * 0.8),
  ...rest
}: {
  defaultValue?: string | null;
  maxLength: number;
  name: string;
  className?: string;
  warningThreshold?: number;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const [value, setValue] = useState(defaultValue ?? "");
  const len = value.length;
  const remaining = maxLength - len;
  const isWarning = len >= warningThreshold && len < maxLength;
  const isLimit = len >= maxLength;

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    if (rest.onChange) rest.onChange(e);
  };

  return (
    <div className="space-y-1">
      <textarea
        {...rest}
        className={`${className} ${isLimit ? "border-red-500 focus:border-red-600" : isWarning ? "border-amber-500 focus:border-amber-600" : ""}`}
        defaultValue={undefined}
        maxLength={maxLength}
        name={name}
        onChange={handleChange}
        value={value}
      />
      <div className="flex justify-between items-center text-xs">
        <span
          className={
            isLimit
              ? "font-bold text-red-600"
              : isWarning
                ? "font-semibold text-amber-600"
                : "text-stone-400"
          }
        >
          {isLimit
            ? "Достигнут максимум символов!"
            : isWarning
              ? `Осталось мало символов: ${remaining}`
              : `Осталось: ${remaining}`}
        </span>
        <span
          className={`font-mono ${isLimit ? "font-bold text-red-600" : isWarning ? "font-semibold text-amber-600" : "text-stone-400"}`}
        >
          {len} / {maxLength}
        </span>
      </div>
    </div>
  );
}
