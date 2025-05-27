import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

import { QUBIC_XMR_FULL_HISTORY_ON_RENDER_URL } from "@/utils/constants";
import { base64ToIntArray } from "@/utils/numbers";

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
  res: NextApiResponse,
) {
  console.log(getPreviousEpochDateUTC());

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

    // const oneHrAveragesDates = data?.data?.response?.graph?.figure?.data[2]?.x as string[];

    // const oneHrAverages = float64ToDecimalArray(
    //   data?.data?.response?.graph?.figure?.data[2]?.y?.bdata as string,
    // );

    // console.log(new Float64Array(data?.data?.response?.graph?.figure?.data[2]?.y?.bdata))

    // let index = oneHrAverages.length - 1;
    // // while(index >= oneHrAverages.length - 1) {
    // //   console.log(oneHrAverages[index], new Date(oneHrAveragesDates[index]))
    // //   index = index - 1;
    // // }

    // // return oneHrAverages[oneHrAverages.length - 1];

    res.status(200).json({
      daily_blocks_found,
      epoch_blocks_found,
      epoch: qubicLiveData?.epoch,
    });
  } catch (e) {
    res.status(400).json({});
  }
}

//now = 1748271372
//00:00UTC = 1748271372
