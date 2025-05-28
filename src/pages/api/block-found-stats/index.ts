import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

import type { MiningStats } from "@/types/MiningStats";
import { QUBIC_XMR_FULL_HISTORY_ON_RENDER_URL } from "@/utils/constants";
import {
  base64ToIntArray,
  float64ToDecimalArray,
  indexOfMax,
} from "@/utils/numbers";

const getPrevious1159AMUTC = (): Date => {
  const now = new Date();
  const target = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      11,
      59,
      0,
      0,
    ),
  );

  // If current time is before 11:59 AM UTC, go to the previous day
  if (now < target) {
    target.setUTCDate(target.getUTCDate() - 1);
  }
  return target;
};

const getPreviousEpochDateUTC = () => {
  const now = new Date();
  const nowDay = now.getUTCDay(); // Sunday = 0, Monday = 1, ..., Wednesday = 3
  const nowUTC = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
    now.getUTCHours(),
    now.getUTCMinutes(),
  );

  // Start with today's date at 11:59 AM UTC
  let target = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      11,
      59,
      0,
      0,
    ),
  );

  // How many days to subtract to get to last Wednesday
  let daysSinceWednesday = (nowDay + 7 - 3) % 7; // 3 is Wednesday
  if (daysSinceWednesday === 0 && nowUTC < target.getTime()) {
    // It's Wednesday but before 11:59 AM UTC — go back a week
    daysSinceWednesday = 7;
  }

  // Move to the correct past Wednesday
  target.setUTCDate(target.getUTCDate() - daysSinceWednesday);

  return target;
};

const getBlocksFoundByStartDate = (
  startDateUTC: Date,
  utcDatesOfBlocksFound: string[], //string of UTC dates same indexing on 'blockIntegers'
  blockIntegers: Uint8Array<ArrayBuffer>, //current total blocks as of the based on the current timestamp,
): number => {
  let totalDailyBlocks = 0;
  const startDateLocal = new Date(startDateUTC);

  const latestIndex = utcDatesOfBlocksFound.length - 1;
  let currentDateUTCIndex = latestIndex;
  while (currentDateUTCIndex >= 0) {
    const currentDateLocal = new Date(
      utcDatesOfBlocksFound[currentDateUTCIndex].concat("Z"),
    );
    if (startDateLocal < currentDateLocal) {
      currentDateUTCIndex = currentDateUTCIndex - 1;
    } else {
      totalDailyBlocks =
        blockIntegers[latestIndex] -
        blockIntegers[currentDateUTCIndex] +
        (blockIntegers[currentDateUTCIndex] -
          blockIntegers[currentDateUTCIndex - 1]);
      break;
    }
  }
  return totalDailyBlocks;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    Pick<
      MiningStats,
      | "hashrate_average_1h"
      | "epoch"
      | "epoch_blocks_found"
      | "daily_blocks_found"
      | "max_hashrate"
      | "max_hashrate_last_update"
    >
  >,
) {
  try {
    const data = await axios.post(QUBIC_XMR_FULL_HISTORY_ON_RENDER_URL, {
      output: "graph.figure",
      outputs: {
        id: "graph",
        property: "figure",
      },
      inputs: [
        { id: "interval", property: "n_intervals", value: 0 },
        { id: "range-picker", property: "value", value: "all" },
      ],
      changedPropIds: [],
      parsedChangedPropsIds: [],
    });

    const utcDatesOfBlocksFound = data?.data?.response?.graph?.figure?.data[3]
      ?.x as string[];
    const blockIntegers = base64ToIntArray(
      data?.data?.response?.graph?.figure?.data[3]?.y?.bdata as string,
    );
    const daily_blocks_found = getBlocksFoundByStartDate(
      getPrevious1159AMUTC(),
      utcDatesOfBlocksFound,
      blockIntegers,
    );

    const epoch_blocks_found = getBlocksFoundByStartDate(
      getPreviousEpochDateUTC(),
      utcDatesOfBlocksFound,
      blockIntegers,
    );

    const qubicLiveData = (
      await axios.get("https://rpc.qubic.org/v1/latest-stats")
    )?.data?.data;

    // one hour hashrate average
    const oneHrAveragesDates = data?.data?.response?.graph?.figure?.data[2]
      ?.x as string[];
    const oneHrAverages = float64ToDecimalArray(
      data?.data?.response?.graph?.figure?.data[2]?.y?.bdata as string,
    );
    const hashrate_average_1h =
      oneHrAverages?.length > 0
        ? oneHrAverages[oneHrAverages.length - 1] * 1000000
        : -1;

    // one hour hashrate average
    const maxHashratesDates = data?.data?.response?.graph?.figure?.data[0]
      ?.x as string[];
    const maxHashrates = float64ToDecimalArray(
      data?.data?.response?.graph?.figure?.data[0]?.y?.bdata as string,
    );

    const maxHashrateIndex = indexOfMax(maxHashrates);
    let max_hashrate = -1,
      max_hashrate_last_update = "";
    if (maxHashrateIndex != -1) {
      max_hashrate = maxHashrates[maxHashrateIndex] * 1000000;
      max_hashrate_last_update = maxHashratesDates[maxHashrateIndex];
    }

    res.status(200).json({
      daily_blocks_found,
      epoch_blocks_found,
      epoch: qubicLiveData?.epoch,
      hashrate_average_1h,
      max_hashrate,
      max_hashrate_last_update,
    });
  } catch (e) {
    res.status(400).json({} as MiningStats);
  }
}

//now = 1748271372
//00:00UTC = 1748271372
