import { useState } from "react";
import type { NextPage } from "next";

import isEmpty from "lodash/isEmpty";
import useSWR from "swr";

import Main from "@/components/main/Main";
import Footer from "@/components/footer/Footer";

import type { MiningStats, XTMHistoryCharts } from "@/types/MiningStats";
import type {
  AdvanceMiningCharts,
  AdvanceMiningStatsResponse,
} from "@/types/MiningStats";
import getMiningStats from "@/apis/mining-stats";
import getTariCalculatedMiningStats from "@/apis/calculated-xtm-stats";
import {
  getAdvanceMiningStats,
  transformAdvanceMiningStats,
} from "@/apis/advance-mining-stats";
import useServerSentEvents from "@/hooks/useServerSentEvents";
import {
  QUBIC_RAILWAY_SERVER_ADVANCE_MINING_STATS_EVENT_STREAM,
  SWR_HOOK_DEFAULTS,
} from "@/utils/constants";

const MINING_STATS_DELAY = 2000;
const CALCULATED_XTM_MINING_STATS_DELAY = 10000;

const MainPage: NextPage<{
  miningStatsProps?: MiningStats;
  advanceMiningStatsProps?: AdvanceMiningCharts;
  tariMiningStatsProps?: XTMHistoryCharts;
}> = ({ miningStatsProps, advanceMiningStatsProps, tariMiningStatsProps }) => {
  const { data: miningStats = miningStatsProps } = useSWR<MiningStats>(
    "/mining-stats",
    getMiningStats,
    {
      ...SWR_HOOK_DEFAULTS,
      refreshInterval: MINING_STATS_DELAY,
      focusThrottleInterval: MINING_STATS_DELAY,
      dedupingInterval: MINING_STATS_DELAY,
    },
  );

  const [advanceMiningStats, setAdvanceMiningStats] =
    useState<AdvanceMiningCharts>(advanceMiningStatsProps);
  useServerSentEvents<AdvanceMiningStatsResponse>(async (data) => {
    const transformedData = await transformAdvanceMiningStats(data);
    setAdvanceMiningStats(transformedData);
  }, QUBIC_RAILWAY_SERVER_ADVANCE_MINING_STATS_EVENT_STREAM);

  const { data: calculatedXTMMiningStats = tariMiningStatsProps } =
    useSWR<XTMHistoryCharts>(
      "/calculated-xtm-mining-stats",
      getTariCalculatedMiningStats,
      {
        ...SWR_HOOK_DEFAULTS,
        refreshInterval: CALCULATED_XTM_MINING_STATS_DELAY,
        focusThrottleInterval: CALCULATED_XTM_MINING_STATS_DELAY,
        dedupingInterval: CALCULATED_XTM_MINING_STATS_DELAY,
      },
    );

  return (
    <>
      <main className="mx-auto mt-1.5 md:mt-8 w-full flex flex-col gap-4 lg:w-2/3 xl:w-[55%] max-w-[1204px] px-3 md:px-12 pt-6 md:pt-4">
        <p className="text-xs opacity-0 absolute">Made by Marty De Viterbo</p>
        <Main
          miningStats={miningStats}
          isLoadingMiningStats={isEmpty(miningStats)}
          advanceMiningStats={advanceMiningStats}
          isLoadingAdvanceMiningStats={isEmpty(advanceMiningStats)}
          calculatedXTMMiningStats={calculatedXTMMiningStats}
          isLoadingCalculatedXTMMiningStats={isEmpty(calculatedXTMMiningStats)}
        />
      </main>

      <footer className="mx-auto w-full flex flex-col gap-4 lg:w-2/3 xl:w-[55%] px-3 md:px-12 py-4 my-4">
        <Footer />
      </footer>
    </>
  );
};

export const getStaticProps = async () => {
  try {
    const miningStats = await getMiningStats();

    const tariMiningStats = await getTariCalculatedMiningStats();

    const advanceMiningStats = await getAdvanceMiningStats();

    return {
      props: {
        miningStatsProps: miningStats,
        advanceMiningStatsProps: advanceMiningStats,
        tariMiningStatsProps: tariMiningStats,
      },
      revalidate: 6,
    };
  } catch (e) {
    console.log("getStaticProps error: ", e);
    return {
      props: {
        miningStats: null,
        advanceMiningStatsProps: null,
        tariMiningStatsProps: null,
      },
      revalidate: 6,
    };
  }
};

export default MainPage;
