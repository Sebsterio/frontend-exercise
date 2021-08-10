import axios from "axios";

export const getData = () =>
  axios
    .get("https://dev.ebitlabs.io/api/v1/fx/ETHUSD/ohlc")
    .then((res) => res.data)
    .catch(() => null);

export const convertPrice = (price: string) => price.split(".");
