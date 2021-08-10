import React, { useState, useEffect } from "react";
import axios from "axios";

// import { Tooltip } from "./Tooltip";

interface Data {
  close: string;
  count: number;
  endTime: {
    microseconds: number;
    seconds: number;
  };
  high: string;
  low: string;
  open: string;
  pair: string;
  startTime: {
    microseconds: number;
    seconds: number;
  };
  volume: string;
  vwap: string;
}

const GET_DATA_INTERVAL = 5 * 1000;

const getData = () =>
  axios
    .get("https://dev.ebitlabs.io/api/v1/fx/ETHUSD/ohlc")
    .then((res) => res.data)
    .catch(() => null);

const convertPrice = (price: string) => price.split(".");

function App() {
  const [data, setData] = useState({} as Data);
  const [price, setPrice] = useState(["", ""]);
  const [error, setError] = useState(true);
  // const [tooltipActive, setTooltipActive] = useState(false);

  const updateData = async () => {
    const newData = await getData();
    if (!newData) return setError(true);
    setData(newData);
    if (error) setError(false);
  };

  // Refresh data on interval
  useEffect(() => {
    updateData();
    const interval = setInterval(updateData, GET_DATA_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  // Keep converted price in the state to avoid running .splice() twice
  useEffect(() => {
    if (!data || !data.close) return;
    setPrice(convertPrice(data.close));
  }, [data]);

  return (
    <>
      {/* {tooltipActive && data && <Tooltip content={String(data.startTime)} />} */}

      <div className="pt-12 bg-gray-50 sm:pt-16">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Ethereum Price
            </h2>
          </div>
        </div>
        <div className="pb-12 mt-10 bg-white sm:pb-16">
          <div
            className="relative"
            // onMouseEnter={() => setTooltipActive(true)}
            // onMouseLeave={() => setTooltipActive(false)}
          >
            <div className="absolute inset-0 h-1/2 bg-gray-50" />
            <div className="relative px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 text-center">
              <dl className="inline-block mx-auto bg-white rounded-lg shadow-lg">
                <div
                  className={`flex flex-col p-6 text-center border-t border-gray-100 ${
                    error ? "text-red" : "text-gray-500"
                  }`}
                >
                  <dt className="order-2 mt-2 text-lg font-medium leading-6">
                    {data?.pair}
                  </dt>
                  <dd className="order-1 text-5xl font-extrabold">
                    ${price[0] ?? "0000"}
                    <span className="text-2xl">.{price[1] ?? "00"}</span>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
