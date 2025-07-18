export const formatLargeNumber = (value: number, scale = 2): string => {
  if (!isValidValue(value)) {
    return "";
  }
  if (value >= 1_000_000) {
    return (value / 1_000_000).toFixed(scale) + "M";
  } else if (value >= 1_000) {
    return (value / 1_000).toFixed(scale) + "k";
  }
  return value.toLocaleString();
};

export const roundToHundreds = (value: number) => {
  return Math.round(value / 100) * 100;
};

export const formatHashrate = (value: number, scale = 2): string => {
  if (!isValidValue(value)) {
    return "";
  }

  if (value >= 1000000000) {
    return (value / 1000000000).toFixed(scale).replace(/\.0$/, "") + " GH/s";
  }
  if (value >= 1000000) {
    return (value / 1000000).toFixed(scale).replace(/\.0$/, "") + " MH/s";
  }
  if (value >= 1000) {
    return (value / 1000).toFixed(scale).replace(/\.0$/, "") + " kH/s";
  }
  if (value === 0) {
    return value.toString();
  }

  return value?.toLocaleString().concat(" H/s");
};

export const isValidValue = (value: number, isZeroAllowed = true) => {
  return !isNaN(value) && (isZeroAllowed ? value >= 0 : value > 0);
};
