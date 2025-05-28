import dayjs from "dayjs";
import { blockToXMRConversion, moneroTicker } from "./constants";
import datetimeDifference, {
  type DateTimeDifference,
} from "datetime-difference";

export const formatPoolHashrateSubValue = (
  pool_hashrate: number,
  network_hashrate: number,
) => {
  let percentage: string | number = (pool_hashrate / network_hashrate) * 100;
  if (!isValidValue(percentage) || percentage === 0) {
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
  return `≈ ${percentage}%`;
};

export const formatPoolBlocksFoundSubValue = (pool_blocks_found: number) => {
  if (!isValidValue(pool_blocks_found)) {
    return "";
  }
  const totalXMR = blockToXMRConversion * pool_blocks_found;
  return `≈ ${totalXMR.toFixed(2)} ${moneroTicker}`;
};

export const formatPeakHashrateDate = (date: string) =>
  dayjs(new Date(date)).format("MMM D, YYYY");

export const getTimeUnitShortVersion = (time: string) => {
  const formatSingularOrPlural =  Number(time.split(" ")[0]) <= 1 ? time.slice(0, -1) : time;
  
  const units = [
    {
      long: "year",
      short: "yr"
    },
    {
      long: "month",
      short: "mo"
    },
    {
      long: "day",
      short: "day"
    },
    {
      long: "hour",
      short: "hr"
    },
    {
      long: "minute",
      short: "min"
    },
    {
      long: "second",
      short: "s"
    }
  ];

  let timeShortForm = formatSingularOrPlural;
  for(const unit of units) {
    console.log(timeShortForm, unit.long)
    if(timeShortForm.includes(unit.long)) {
      timeShortForm = timeShortForm.replace(unit.long, unit.short);
      break;
    }
  }
  return timeShortForm;
}

export const formatLatestBlockFoundSubValue = (last_block_found: number) => {
  if (!isValidValue(last_block_found)) {
    return "";
  }

  const latestBlockFound = Number(`${last_block_found}000`);

  const difference = datetimeDifference(new Date(latestBlockFound), new Date());

  let formattedDifference = (
    Object.keys(difference) as unknown as (keyof DateTimeDifference)[]
  )
    .filter((k) => !!difference[k])
    .map((k) => `${difference[k]} ${k}`)[0];

  return `≈ ${getTimeUnitShortVersion(formattedDifference)} ago`;
};

export const isValidValue = (value: number) => {
  return !isNaN(value) && value >= 0;
};
