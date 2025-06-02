export const formatLargeInteger = (value: number) => {
  if (!isValidValue(value)) {
    return "-";
  }

  if (value >= 1000000000) {
    return (value / 1000000000).toFixed(2).replace(/\.0$/, "") + " GH/s";
  }
  if (value >= 1000000) {
    return (value / 1000000).toFixed(2).replace(/\.0$/, "") + " MH/s";
  }
  if (value >= 1000) {
    return (value / 1000).toFixed(2).replace(/\.0$/, "") + " KH/s";
  }
  if (value === 0) {
    return value;
  }
  return value?.toFixed(2).toLocaleString().concat(" H/s");
};

export const isValidValue = (value: number, isZeroAllowed = true) => {
  return !isNaN(value) && (isZeroAllowed ? value >= 0 : value > 0);
};

export const getNearestFloor = (value: number) => {
  if (value >= 1000) {
    return Math.floor(value / 1000) * 1000;
  }
  return Math.floor(value / 100) * 100;
};

export const isWarningBounceForPoolBlocksFounds = (
  pool_blocks_found?: number,
) => {
  if (!isValidValue(pool_blocks_found, false)) {
    return;
  }

  let nearestCeiling = 0;

  if (pool_blocks_found >= 1000) {
    nearestCeiling = Math.ceil(pool_blocks_found / 1000) * 1000;
  } else {
    nearestCeiling = Math.ceil(pool_blocks_found / 100) * 100;
  }
  return (
    nearestCeiling - pool_blocks_found <= 5 &&
    nearestCeiling - pool_blocks_found >= 1
  );
};
