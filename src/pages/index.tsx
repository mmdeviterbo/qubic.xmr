import { useState } from "react";
import type { NextPage } from "next";

import Head from "next/head";
import axios from "axios";
import isEmpty from "lodash/isEmpty";

import type { CalculatedMiningStats, MiningStats } from "@/types/MiningStats";
import SimpleMode from "@/components/simple-mode/SimpleMode";
import { MODE } from "@/types/views";
import AdvancedMode from "@/components/advanced-mode/AdvancedMode";
import useSWR from "swr";
import {
  CALCULATED_MINING_STATS_URL,
  MINING_STATS_URL,
} from "@/utils/constants";

const Main: NextPage<{
  miningStatsProps?: MiningStats;
  calculatedMiningStatsProps?: CalculatedMiningStats;
}> = ({ miningStatsProps, calculatedMiningStatsProps }) => {
  const [mode, setMode] = useState<MODE>(MODE.SIMPLE);

  const {
    data: miningStats = miningStatsProps,
    isLoading: isLoadingMiningStats,
  } = useSWR<MiningStats>(
    MINING_STATS_URL,
    async () => (await fetch(MINING_STATS_URL)).json(),
    {
      refreshInterval: 10000,
      focusThrottleInterval: 10000,
      fallbackData: miningStatsProps,
    },
  );

  const {
    data: calculatedMiningStats = calculatedMiningStatsProps,
    isLoading: isLoadingCalculatedMiningStats,
  } = useSWR<CalculatedMiningStats>(
    CALCULATED_MINING_STATS_URL,
    async () => (await fetch(CALCULATED_MINING_STATS_URL)).json(),
    {
      refreshInterval: 90000,
      focusThrottleInterval: 30000,
      fallbackData: miningStatsProps,
    },
  );

  return (
    <>
      <Head>
        <link rel="icon" href="/qubic.svg" sizes="any" type="image/svg+xml" />
        <title>Qubic-XMR Live</title>
      </Head>

      <div className="md:mt-4 flex justify-center">
        {mode === MODE.SIMPLE ? (
          <SimpleMode
            miningStats={isLoadingMiningStats ? miningStatsProps : miningStats}
            isLoadingMiningStats={
              isEmpty(miningStatsProps) && isLoadingMiningStats
            }
            calculatedMiningStats={
              isLoadingCalculatedMiningStats
                ? calculatedMiningStatsProps
                : calculatedMiningStats
            }
            isLoadingCalculatedMiningStats={
              isEmpty(calculatedMiningStatsProps) &&
              isLoadingCalculatedMiningStats
            }
          />
        ) : (
          <AdvancedMode />
        )}
      </div>

      <canvas className="confetti absolute top-0 left-0 z-50 h-full w-full" />
    </>
  );
};

export const getServerSideProps = async () => {
  try {
    const baseUrl = process.env.BASE_URL;

    const calculatedMiningStatsResponse =
      await axios.get<CalculatedMiningStats>(
        `${baseUrl}/api/calculated-stats`,
        { timeout: 12000 },
      );

    const miningStatsResponse = await axios.get<MiningStats>(
      `${baseUrl}/api/mining-stats`,
    );

    let miningStatsProps: MiningStats;
    if (miningStatsResponse.status === 200) {
      miningStatsProps = miningStatsResponse?.data;
    }

    let calculatedMiningStats: CalculatedMiningStats;
    if (calculatedMiningStatsResponse.status === 200) {
      calculatedMiningStats = calculatedMiningStatsResponse?.data;
    }

    return { props: { miningStatsProps, calculatedMiningStats } };
  } catch (e) {
    return { props: {} };
  }
};

export default Main;
