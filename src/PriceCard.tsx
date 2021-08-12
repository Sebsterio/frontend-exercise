import React, { useState, useEffect, useMemo } from "react";

import { getData } from "./price-service";
import { ensurePadding, getPriceDiffs } from "./helpers";
import { Digit } from "./Digit";
import { Data, Price } from "./types";

import { Currency, Map } from "./types";

const GET_DATA_INTERVAL = 5 * 1000;

const currencySymbolMap: Map = {
  USD: "$",
  GBP: "£",
};

interface Props {
  currency: Currency;
  setTooltipContent: React.Dispatch<React.SetStateAction<string>>;
}

export function PriceCard({ currency, setTooltipContent }: Props) {
  const [data, setData] = useState({} as Data);
  const [price, setPrice] = useState([] as Price);
  const [error, setError] = useState(false);

  const startTimeString = useMemo(() => {
    if (!data.startTime) return "";
    const { seconds, microseconds } = data.startTime;
    const ms = seconds * 1000 + Math.round(microseconds / 1000);
    return new Date(ms).toISOString();
  }, [data]);

  const updateData = async () => {
    const newData = await getData(currency);
    if (!newData) return setError(true);
    newData.close = ensurePadding(newData.close);
    setData((oldData) => {
      setPrice(getPriceDiffs(oldData, newData));
      return newData;
    });
    if (error) setError(false);
  };

  useEffect(() => {
    updateData();
    const interval = setInterval(updateData, GET_DATA_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="relative m-2 max-w-7xl text-center">
        <dl className="inline-block mx-auto bg-white rounded-lg shadow-lg">
          <div
            className={`no-hover-on-children flex flex-col p-6 text-center text-gray-500 ${
              error ? "border-4 border-red-500" : "border-t border-gray-100"
            }`}
            onMouseOver={() => setTooltipContent(startTimeString ?? "")}
            onMouseOut={() => setTooltipContent("")}
          >
            {Object.keys(data).length ? (
              <>
                <dt className="order-2 mt-2 text-lg font-medium leading-6">
                  {data?.pair}
                </dt>

                <dd className="order-1 font-extrabold price-highlight">
                  <span className="text-5xl">
                    {currencySymbolMap[currency]}
                  </span>

                  {price.map((digit, i) => (
                    <Digit key={i + digit.value} {...digit} />
                  ))}
                </dd>
              </>
            ) : (
              <h2>Loading...</h2>
            )}
          </div>
        </dl>
      </div>
    </>
  );
}
