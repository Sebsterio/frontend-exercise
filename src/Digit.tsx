import React from "react";

import { Map, DigitObject } from "./types";

const changeClassMap: Map = {
  true: "price-highlight__positive",
  false: "price-highlight__negative",
  null: "",
} as const;

export function Digit({ value, isInteger, change }: DigitObject) {
  return (
    <span
      className={[
        isInteger ? "text-5xl" : "text-2xl",
        changeClassMap[String(change)],
      ].join(" ")}
    >
      {value}
    </span>
  );
}
