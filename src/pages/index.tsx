import type { NextPage } from "next";

import axios from "axios";
import isEmpty from "lodash/isEmpty";
import useSWR from "swr";
import dynamic from "next/dynamic";

import Main from "@/components/main/Main";
import type {
  CalculatedXMRMiningStats,
  MiningStats,
  XTMHistoryCharts,
} from "@/types/MiningStats";
import getMiningStats from "@/apis/mining-stats";
import getTariCalculatedMiningStats from "@/apis/calculated-xtm-stats";
import getMoneroCalculatedMiningStats from "@/apis/calculated-xmr-stats";
import { SWR_HOOK_DEFAULTS } from "@/utils/constants";

const Footer = dynamic(() => import("@/components/footer/Footer"), {
  ssr: false,
});

const MINING_STATS_DELAY = 3000;
const CALCULATED_XMR_MINING_STATS_DELAY = 6000;
const CALCULATED_XTM_MINING_STATS_DELAY = 12000;

const MainPage: NextPage<{
  calculatedXMRMiningStatsProps?: CalculatedXMRMiningStats;
}> = ({ calculatedXMRMiningStatsProps }) => {
  const { data: miningStats } = useSWR<MiningStats>(
    "/mining-stats",
    getMiningStats,
    {
      ...SWR_HOOK_DEFAULTS,
      refreshInterval: MINING_STATS_DELAY,
      focusThrottleInterval: MINING_STATS_DELAY,
      dedupingInterval: MINING_STATS_DELAY,
    },
  );

  const {
    data: calculatedXMRMiningStats = calculatedXMRMiningStatsProps,
    isLoading: isLoadingCalculatedXMRMiningStats,
  } = useSWR<CalculatedXMRMiningStats>(
    "/calculated-xmr-mining-stats",
    getMoneroCalculatedMiningStats,
    {
      ...SWR_HOOK_DEFAULTS,
      refreshInterval: CALCULATED_XMR_MINING_STATS_DELAY,
      focusThrottleInterval: CALCULATED_XMR_MINING_STATS_DELAY,
      dedupingInterval: CALCULATED_XMR_MINING_STATS_DELAY,
    },
  );

  const { data: calculatedXTMMiningStats } = useSWR<XTMHistoryCharts>(
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
          calculatedXMRMiningStats={
            isLoadingCalculatedXMRMiningStats ||
            isEmpty(calculatedXMRMiningStats)
              ? calculatedXMRMiningStatsProps
              : calculatedXMRMiningStats
          }
          isLoadingCalculatedXMRMiningStats={
            isEmpty(calculatedXMRMiningStatsProps) &&
            isEmpty(calculatedXMRMiningStats)
          }
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
    const baseUrl = process.env.BASE_URL;

    const calculatedMiningStatsResponse =
      await axios.get<CalculatedXMRMiningStats>(
        `${baseUrl}/api/calculated-mining-stats`,
      );

    return {
      props: {
        calculatedXMRMiningStatsProps: calculatedMiningStatsResponse?.data,
      },
      revalidate: 12,
    };
  } catch (e) {
    console.log("getStaticProps error: ", e);
    return {
      props: { calculatedXMRMiningStatsProps: null },
      revalidate: 12,
    };
  }
};

export default MainPage;
