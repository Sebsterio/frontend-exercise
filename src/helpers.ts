import { Data, DigitObject, Price } from "./types";

export const ensurePadding = (string: string) =>
  string.replace(/[.](\d)$/, ".$1" + "0").replace(/^(\d+)$/, "$1" + ".00");

export const getPriceDiffs = (
  { close: oldPriceString }: Data,
  { close: newPriceString }: Data,
): Price => {
  const newPriceArray = newPriceString.split("");

  // Numerical difference
  const delta = oldPriceString
    ? parseFloat(newPriceString) - parseFloat(oldPriceString)
    : 0;

  // Has string length changed
  const lengthChanged = !!delta
    ? oldPriceString.length !== newPriceArray.length
    : false;

  // Index of the first digit that changed
  // prettier-ignore
  const firstDiffIndex = lengthChanged ? 0 // if length changed, all digits changed
    : !delta ? newPriceString.length // if no difference, no digits changed
    : (() => {
        const oldPriceArray = oldPriceString.split("");
        return newPriceArray.findIndex(
          (char: string, i: number) => char !== oldPriceArray[i],
        );
      })();

  // Convert priceString into an array of digit objects
  const priceIncreased = !delta ? null : delta > 0;
  const dotIndex = newPriceArray.findIndex((char) => char === ".");
  const digitsArray = newPriceArray.map(
    (char: string, i: number): DigitObject => ({
      value: char,
      isInteger: i < dotIndex,
      change: i < firstDiffIndex ? null : priceIncreased,
    }),
  );

  return digitsArray;
};

// Previous version; not entirely sure if the refactor is cleaner but I'm curious what you think

// export const getPriceDiffs = (
//   { close: oldPriceString }: Data,
//   { close: newPriceString }: Data,
// ): Price => {
//   const newPriceArray = newPriceString.split("");

//   let delta = 0; // Numerical change of price
//   let lengthChanged = false; // String length
//   let firstDiffIndex = 0; // Index of the first digit that changed

//   if (oldPriceString) {
//     const oldPriceNum = parseFloat(oldPriceString);
//     const newPriceNum = parseFloat(newPriceString);
//     delta = newPriceNum - oldPriceNum;
//   }

//   if (delta) {
//     lengthChanged = oldPriceString.length !== newPriceString.length;
//   }

//   // Find first digit that changed
//   if (!delta) {
//     firstDiffIndex = newPriceString.length;
//   } else if (!lengthChanged) {
//     const oldPriceArray = oldPriceString.split("");
//     firstDiffIndex = newPriceArray.findIndex(
//       (char: string, i: number) => char !== oldPriceArray[i],
//     );
//   }

//   // Convert priceString into an array of digit objects
//   const priceIncreased = !delta ? null : delta > 0;
//   const dotIndex = newPriceArray.findIndex((char) => char === ".");
//   const digitsArray = newPriceArray.map(
//     (char: string, i: number): DigitObject => ({
//       value: char,
//       isInteger: i < dotIndex,
//       change: i < firstDiffIndex ? null : priceIncreased,
//     }),
//   );

//   return digitsArray;
// };
