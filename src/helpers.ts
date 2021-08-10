import axios from "axios";

import { Data } from "./types";

export const getData = () =>
  axios
    .get("https://dev.ebitlabs.io/api/v1/fx/ETHUSD/ohlc")
    .then((res) => res.data)
    .catch(() => null);

//
// Messy but it got late. Happy to refactor tomorrow. -Seb
//
const makeDataObj = (
  data: Data,
  price: string | [string, string] = data.close,
) => ({
  ...data,
  price: Array.isArray(price) ? price : (price.split(".") as [string, string]),
});

export const convertData = (oldData: Data, newData: Data) => {
  if (!oldData.close) return makeDataObj(newData);

  const { close: oldPrice } = oldData;
  const { close: newPrice } = newData;
  const oldPriceNum = parseFloat(oldPrice);
  const newPriceNum = parseFloat(newPrice);
  const diff = newPriceNum - oldPriceNum;

  if (!diff) return makeDataObj(newData);

  const className = diff > 0 ? "positive" : "negative";

  if (oldPrice.length !== newPrice.length) {
    const result = newData.close
      .split(".")
      .map((string) => `<span class="${className}">${string}</span>`);

    return makeDataObj(newData, result as [string, string]);
  }

  const oldPriceArray = oldPrice.split("");
  const newPriceArray = newPrice.split("");
  let foundDiffPoint = false;
  const result = newPriceArray
    .map((char, i) => {
      if (char === ".") return char;

      const oldChar = oldPriceArray[i];
      if (foundDiffPoint || oldChar !== char) {
        foundDiffPoint = true;
        return `<span class="${className}">${char}</span>`;
      }

      return char;
    })
    .join("");

  return makeDataObj(newData, result);
};
