export const formatLargeInteger = (value: number) => {
  if (value >= 1000000000) {
    return (value / 1000000000).toFixed(2).replace(/\.0$/, "") + " GH/s";
  }
  if (value >= 1000000) {
    return (value / 1000000).toFixed(2).replace(/\.0$/, "") + " MH/s";
  }
  if (value >= 1000) {
    return (value / 1000).toFixed(2).replace(/\.0$/, "") + " KH/s";
  }
  return value?.toLocaleString().concat(" H/s");
};
