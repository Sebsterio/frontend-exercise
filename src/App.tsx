import React, { useState, useEffect, useMemo } from "react";

import { getData, convertPrice } from "./helpers";
import { Tooltip } from "./Tooltip";

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

function App() {
  const [data, setData] = useState({} as Data);
  const [price, setPrice] = useState(["", ""]);
  const [error, setError] = useState(false);
  const [tooltipActive, setTooltipActive] = useState(false);

  const startTimeString = useMemo(() => {
    if (!data.startTime) return "";
    const { seconds, microseconds } = data.startTime;
    const ms = seconds * 1000 + Math.round(microseconds / 1000);
    return new Date(ms).toISOString();
  }, [data.startTime]);

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

  // Format price on data update
  useEffect(() => {
    if (!data || !data.close) return;
    setPrice(convertPrice(data.close));
  }, [data]);

  return (
    <>
      <div className="pt-12 bg-gray-50 sm:pt-16">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Ethereum Price
            </h2>
          </div>
        </div>
        <div className="pb-12 mt-10 bg-white sm:pb-16">
          {Object.keys(data).length ? (
            <div className="relative">
              <div className="absolute inset-0 h-1/2 bg-gray-50" />
              <div className="relative px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 text-center">
                <dl className="inline-block mx-auto bg-white rounded-lg shadow-lg">
                  <div
                    className={`no-hover-on-children flex flex-col p-6 text-center text-gray-500 ${
                      error
                        ? "border-4 border-red-500"
                        : "border-t border-gray-100"
                    }`}
                    onMouseOver={() => setTooltipActive(true)}
                    onMouseOut={() => setTooltipActive(false)}
                  >
                    <dt className="order-2 mt-2 text-lg font-medium leading-6">
                      {data?.pair}
                    </dt>
                    <dd className="order-1 text-5xl font-extrabold">
                      ${price[0] || "0000"}
                      <span className="text-2xl">.{price[1] || "00"}</span>
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          ) : (
            <div className="absolute inset-0 flex justify-center items-center">
              <h2>Loading...</h2>
            </div>
          )}
        </div>
      </div>

      {tooltipActive && data && <Tooltip content={startTimeString} />}
    </>
  );
}

export default App;
