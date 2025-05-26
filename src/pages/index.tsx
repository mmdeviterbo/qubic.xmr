import { useCallback, useEffect, useMemo, useState } from "react";
import type { NextPage } from "next";

import Head from "next/head";
import axios from "axios";

import QubicLogo from "@/components/common/logos/QubicLogo";
import Card from "@/components/common/Card";

import type { MiningStats } from "@/types/MiningStats";
import { Labels } from "@/utils/constants";
import {
  formatLatestBlockFound,
  formatLatestBlockFoundSubValue,
  formatPoolBlocksFoundSubValue,
  formatPoolHashrateSubValue,
  isValidValue,
} from "@/utils/transformers";
import { formatLargeInteger } from "@/utils/numbers";
import Footer from "@/components/footer/Footer";

const Main: NextPage<{
  miningStatsProps?: MiningStats;
}> = ({ miningStatsProps }) => {
  const [miningStats, setMiningStats] = useState<MiningStats>(miningStatsProps);

  const {
    pool_hashrate,
    pool_blocks_found,
    connected_miners,
    last_block_found,
    hashrate_average_1h,
    hashrate_average_7d,
    network_hashrate: monero_network_hashrate,
    network_difficulty: monero_network_difficulty,
  } = miningStats ?? {};

  const fetchMiningStats = useCallback(async () => {
    const response = await axios.get("/api/mining-stats");
    if (response?.status === 200) {
      setMiningStats(response.data);
    }
  }, []);

  useEffect(() => {
    if (!miningStatsProps) {
      void fetchMiningStats();
    }
    setInterval(() => {
      void fetchMiningStats();
    }, 10000); //10sec
  }, []);

  const isLoadingStats = useMemo(
    () => !Object.keys(miningStats ?? {}).length,
    [miningStats],
  );

  return (
    <>
      <Head>
        <link rel="icon" href="/qubic.svg" sizes="any" type="image/svg+xml" />
        <title>Qubic-XMR Live</title>
      </Head>

      <div className="md:mt-4 flex justify-center">
        <main className="w-full flex flex-col gap-16 lg:w-1/3 px-12 py-32">
          <div className="md:mb-2">
            <QubicLogo showTitle={true} />
          </div>

          <Card
            label={Labels.HASHRATE}
            value={formatLargeInteger(pool_hashrate)}
            subValue={formatPoolHashrateSubValue(
              pool_hashrate,
              monero_network_hashrate,
            )}
            loading={isLoadingStats}
            toolTip={
              "Percentage of pool hashrate over Monero's network hashrate"
            }
          />
          <div className="flex gap-16">
            <Card
              label={Labels.AVG_1H_HASHRATE}
              value={formatLargeInteger(hashrate_average_1h)}
              loading={isLoadingStats}
              customClass={"w-1/2"}
            />
            <Card
              label={Labels.AVG_7D_HASHRATE}
              value={formatLargeInteger(hashrate_average_7d)}
              loading={isLoadingStats}
              customClass={"w-1/2"}
            />
          </div>

          <Card
            label={Labels.BLOCKS_FOUND}
            value={
              isValidValue(pool_blocks_found)
                ? pool_blocks_found?.toLocaleString()
                : "-"
            }
            subValue={formatPoolBlocksFoundSubValue(pool_blocks_found)}
            toolTip={"One block is approximately equivalent to 0.60 XMR"}
            loading={isLoadingStats}
          />
          <Card
            label={Labels.LAST_BLOCK_FOUND}
            value={formatLatestBlockFound(last_block_found)}
            loading={isLoadingStats}
            subValue={formatLatestBlockFoundSubValue(last_block_found)}
          />
          <Card
            label={Labels.CONNECTED_MINERS}
            value={
              isValidValue(connected_miners)
                ? connected_miners?.toLocaleString()
                : "-"
            }
            loading={isLoadingStats}
          />
          <Card
            label={Labels.MONERO_NETWORK_HASHRATE}
            value={formatLargeInteger(monero_network_hashrate)}
            loading={isLoadingStats}
            customClass="mt-4"
          />
          <Card
            label={Labels.MONERO_NETWORK_DIFFICULTY}
            value={
              isValidValue(monero_network_difficulty)
                ? monero_network_difficulty.toLocaleString()
                : "-"
            }
            loading={isLoadingStats}
          />

          <Footer />
        </main>
      </div>
    </>
  );
};

export const getServerSideProps = async () => {
  try {
    const baseUrl = process.env.BASE_URL;
    const miningStatsResponse = await axios.get(`${baseUrl}/api/mining-stats`);
    if (miningStatsResponse.status === 200) {
      return { props: { miningStatsProps: miningStatsResponse?.data } };
    }
    return { props: {} };
  } catch (e) {
    return { props: {} };
  }
};

export default Main;
