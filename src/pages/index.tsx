import type { NextPage } from "next";

import Head from "next/head";
import axios from "axios";
import isEmpty from "lodash/isEmpty";
import useSWR from "swr";

import type { CalculatedMiningStats, MiningStats } from "@/types/MiningStats";
import Main from "@/components/main/Main";
import {
  ABOUT_ME_NOTE,
  CALCULATED_MINING_STATS_URL,
  MINING_STATS_URL,
  SWR_HOOK_DEFAULTS,
} from "@/utils/constants";

const MainPage: NextPage<{
  miningStatsProps?: MiningStats;
}> = ({ miningStatsProps }) => {
  const {
    data: miningStats = miningStatsProps,
    isLoading: isLoadingMiningStats,
  } = useSWR<MiningStats>(
    MINING_STATS_URL,
    async () => (await fetch(MINING_STATS_URL)).json(),
    {
      ...SWR_HOOK_DEFAULTS,
      refreshInterval: 15000,
      focusThrottleInterval: 15000,
      dedupingInterval: 15000,
    },
  );

  const {
    data: calculatedMiningStats,
    isLoading: isLoadingCalculatedMiningStats,
  } = useSWR<CalculatedMiningStats>(
    CALCULATED_MINING_STATS_URL,
    async () => (await fetch(CALCULATED_MINING_STATS_URL)).json(),
    {
      ...SWR_HOOK_DEFAULTS,
      refreshInterval: 90000,
      focusThrottleInterval: 90000,
      dedupingInterval: 90000,
    },
  );

  return (
    <>
      <Head>
        <link rel="icon" href="/qubic.svg" sizes="any" type="image/svg+xml" />
        <title>Qubic Custom Mining</title>
        <meta name="description" content={ABOUT_ME_NOTE}></meta>
      </Head>

      <div className="md:mt-4 flex justify-center">
        <Main
          miningStats={isLoadingMiningStats ? miningStatsProps : miningStats}
          isLoadingMiningStats={
            isEmpty(miningStatsProps) && isLoadingMiningStats
          }
          calculatedMiningStats={calculatedMiningStats}
          isLoadingCalculatedMiningStats={isLoadingCalculatedMiningStats}
        />
      </div>

      <canvas className="confetti absolute top-0 left-0 z-50 h-full w-full" />
    </>
  );
};

export const getServerSideProps = async (ctx) => {
  try {
    ctx.res.setHeader("Cache-Control", "public, max-age=15");
    ctx.res.setHeader("CDN-Cache-Control", "public, max-age=25");
    ctx.res.setHeader("Vercel-CDN-Cache-Control", "public, max-age=35");

    const baseUrl = process.env.BASE_URL;

    const miningStatsResponse = await axios.get<MiningStats>(
      `${baseUrl}/api/mining-stats`,
    );

    let miningStatsProps: MiningStats;
    if (miningStatsResponse.status === 200) {
      miningStatsProps = miningStatsResponse?.data;
    }

    return { props: { miningStatsProps } };
  } catch (e) {
    return { props: {} };
  }
};

export default MainPage;
