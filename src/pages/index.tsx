import { useCallback, useEffect, useState } from "react";
import { Analytics } from "@vercel/analytics/next";
import type { NextPage } from "next";

import Head from "next/head";
import axios from "axios";

import type { CalculatedMiningStats, MiningStats } from "@/types/MiningStats";
import SimpleMode from "@/components/simple-mode/SimpleMode";
import { MODE } from "@/types/views";
import AdvancedMode from "@/components/advanced-mode/AdvancedMode";
import { useConfettiBlocksFound } from "@/hooks/useConfettiBlocksFound";

const Main: NextPage<{
  miningStatsProps?: MiningStats;
}> = ({ miningStatsProps }) => {
  const [mode, setMode] = useState<MODE>(MODE.SIMPLE);
  const [miningStats, setMiningStats] = useState<MiningStats>(miningStatsProps);
  const [calculatedMiningStats, setCalculatedMiningStats] =
    useState<CalculatedMiningStats>(miningStatsProps);

  const fetchCalculatedMiningStats = useCallback(async () => {
    const response = await axios.get("/api/calculated-stats");
    if (response?.status === 200) {
      setCalculatedMiningStats(response.data);
    }
  }, []);

  const fetchMiningStats = useCallback(async () => {
    const response = await axios.get("/api/mining-stats");
    if (response?.status === 200) {
      setMiningStats(response.data);
    }
  }, []);

  useEffect(() => {
    setInterval(() => {
      void fetchMiningStats();
    }, 10000); //10sec
  }, []);

  useEffect(() => {
    setInterval(() => {
      void fetchCalculatedMiningStats();
    }, 90000); //90sec / 1.5min
  }, []);

  useConfettiBlocksFound(miningStats?.pool_blocks_found);

  return (
    <>
      <Analytics />

      <Head>
        <link rel="icon" href="/qubic.svg" sizes="any" type="image/svg+xml" />
        <title>Qubic-XMR Live</title>
      </Head>

      <canvas className="confetti absolute top-0 left-0 z-50 h-full w-full" />

      <div className="md:mt-4 flex justify-center">
        {mode === MODE.SIMPLE ? (
          <SimpleMode
            miningStats={miningStats}
            calculatedMiningStats={calculatedMiningStats}
          />
        ) : (
          <AdvancedMode />
        )}
      </div>
    </>
  );
};

export const getServerSideProps = async () => {
  try {
    const baseUrl = process.env.BASE_URL;
    const blockFoundStatsResponse = await axios.get(
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

    if (blockFoundStatsResponse.status === 200) {
      miningStatsProps = {
        ...miningStatsProps,
        ...blockFoundStatsResponse?.data,
      };
    }

    return { props: { miningStatsProps } };
  } catch (e) {
    return { props: {} };
  }
};

export default Main;
