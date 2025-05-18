import dayjs from "dayjs";
import { blockToXMRConversion, moneroTicker } from "./constants";

export const formatPoolHashrateSubValue = (
  pool_hashrate: number,
  network_hashrate: number,
) => {
  let percentage: string | number = (pool_hashrate / network_hashrate) * 100;
  if (isNaN(percentage) || percentage === 0) {
    return "";
  }
  const wholeNumberPercentage = Math.trunc(percentage);
  const threeDecimalPercentage = Number(percentage.toFixed(3));
  if (threeDecimalPercentage === 0) {
    percentage = Math.trunc(percentage);
  } else if (wholeNumberPercentage > 0) {
    percentage = percentage.toFixed(1);
  } else {
    percentage = percentage.toFixed(3);
  }
  return `≈${percentage}%`;
};

export const formatPoolBlocksFoundSubValue = (pool_blocks_found: number) => {
  if (isNaN(pool_blocks_found) || pool_blocks_found <= 0) {
    return "";
  }
  const totalXMR = blockToXMRConversion * pool_blocks_found;
  return `≈${totalXMR.toFixed(2)} ${moneroTicker}`;
};

export const formatLatestBlockFound = (last_block_found: number) => {
  const latestBlockFound = Number(`${last_block_found}000`);
  return last_block_found
    ? dayjs(new Date(latestBlockFound)).format("MMM D, YYYY h:mA")
    : "";
};
