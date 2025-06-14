export const formatLargeNumber = (value: number): string => {
  if (!isValidValue(value)) {
    return "-";
  }
  return value?.toLocaleString();
};

export const formatHashrate = (value: number, scale = 2): string => {
  if (!isValidValue(value)) {
    return "-";
  }

  if (value >= 1000000000) {
    return (value / 1000000000).toFixed(scale).replace(/\.0$/, "") + " GH/s";
  }
  if (value >= 1000000) {
    return (value / 1000000).toFixed(scale).replace(/\.0$/, "") + " MH/s";
  }
  if (value >= 1000) {
    return (value / 1000).toFixed(scale).replace(/\.0$/, "") + " KH/s";
  }
  if (value === 0) {
    return value.toString();
  }
  return formatLargeNumber(value).concat(" H/s");
};

export const isValidValue = (value: number, isZeroAllowed = true) => {
  return !isNaN(value) && (isZeroAllowed ? value >= 0 : value > 0);
};
