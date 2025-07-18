import { formatLargeNumber, isValidValue } from "./numbers";
import {
  blockToXMRConversion,
  Labels,
  moneroTicker,
  tariTicker,
} from "./constants";
import datetimeDifference, {
  type DateTimeDifference,
} from "datetime-difference";

export const formatPoolHashrateSubValue = (
  pool_hashrate: number,
  network_hashrate: number,
) => {
  let percentage: string | number = (pool_hashrate / network_hashrate) * 100;
  if (!isValidValue(percentage, false)) {
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
  return `${percentage}%`;
};

export const formatMoneroBlocksFoundSubValue = (pool_blocks_found: number) => {
  if (!isValidValue(pool_blocks_found, false)) {
    return "";
  }
  const totalXMR = blockToXMRConversion * pool_blocks_found;
  return `≈ ${formatLargeNumber(totalXMR)} ${moneroTicker}`;
};

export const formatTariBlocksFoundSubValue = (total_rewards: number) => {
  if (!isValidValue(total_rewards, false)) {
    return "";
  }
  return `≈ ${formatLargeNumber(total_rewards)} ${tariTicker}`;
};

export const formatPeakHashrateDateDifference = (date: string) => {
  if (!date) {
    return [];
  }

  const dateInt = Math.trunc(new Date(date).getTime() / 1000);

  const timeDifference = formatLatestBlockFoundSubValue(dateInt)?.replace(
    "≈",
    "",
  );

  if (timeDifference) {
    return [Labels.ATH_HASHRATE, " • ", timeDifference];
  }
  return [];
};

export const getTimeUnitShortVersion = (time: string) => {
  const formatSingularOrPlural =
    Number(time.split(" ")[0]) <= 1 ? time.slice(0, -1) : time;

  const units = [
    {
      long: "year",
      short: "yr",
    },
    {
      long: "month",
      short: "mo",
    },
    {
      long: "day",
      short: "day",
    },
    {
      long: "hour",
      short: "hr",
    },
    {
      long: "minute",
      short: "min",
    },
    {
      long: "second",
      short: "sec",
    },
  ];

  let timeShortForm = formatSingularOrPlural;
  for (const unit of units) {
    if (timeShortForm.includes(unit.long)) {
      timeShortForm = timeShortForm.replace(unit.long, unit.short);
      break;
    }
  }
  return timeShortForm;
};

export const formatLatestBlockFoundSubValue = (
  last_block_found: number | string,
) => {
  const isAlreadyInDateFormat = typeof last_block_found === "string";

  if (!isAlreadyInDateFormat && !isValidValue(last_block_found, false)) {
    return "";
  }

  const latestBlockFound = isAlreadyInDateFormat
    ? last_block_found
    : Number(last_block_found * 1000);

  const difference = datetimeDifference(new Date(latestBlockFound), new Date());

  let formattedDifference = (
    Object.keys(difference) as unknown as (keyof DateTimeDifference)[]
  )
    .filter((k) => !!difference[k])
    .map((k) => `${difference[k]} ${k}`)[0];

  return `${getTimeUnitShortVersion(formattedDifference)} ago`;
};
