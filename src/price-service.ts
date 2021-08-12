import axios from "axios";

import { Currency } from "./types";

export const getData = (currency: Currency) =>
  axios
    .get(`https://dev.ebitlabs.io/api/v1/fx/ETH${currency}/ohlc`)
    .then((res) => res.data)
    .catch(() => null);
