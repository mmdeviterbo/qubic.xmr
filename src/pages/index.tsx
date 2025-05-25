import { useEffect, useMemo, useState } from "react";
import { NextPage } from "next";

import Link from "next/link";
import Head from "next/head";
import axios from "axios";

import QubicLogo from "@/components/logos/QubicLogo";
import Card from "@/components/Card";

import type { MiningAverageStats, MiningStats } from "@/types/MiningStats";
import { Labels, QUBIC_XMR_STATS_URL } from "@/utils/constants";
import {
  formatLatestBlockFound,
  formatLatestBlockFoundSubValue,
  formatPoolBlocksFoundSubValue,
  formatPoolHashrateSubValue,
} from "@/utils/transformers";
import { formatLargeInteger } from "@/utils/numbers";

const MiningStats: NextPage = () => {
  const [miningStats, setMiningStats] = useState<MiningStats>();
  const [miningAverageStats, setMiningAverageStats] =
    useState<MiningAverageStats>();

  const {
    pool_hashrate = 0,
    pool_blocks_found = 0,
    connected_miners = 0,
    last_block_found = 0,
    network_hashrate: monero_network_hashrate = 0,
    network_difficulty: monero_network_difficulty = 0,
  } = miningStats ?? {};

  const { hashrate_average_1h = 0, hashrate_average_7d = 0 } =
    miningAverageStats ?? {};

  const fetchMiningStats = async () => {
    const response = await axios.get("/api/qubic-xmr-stats");
    if (response.status === 200) {
      setMiningStats(response.data);
    }
  };

  const fetchMiningAverages = async () => {
    const response = await axios.get("/api/qubic-xmr-hashrate-averages");
    if (response.status === 200) {
      setMiningAverageStats(response.data);
    }
  };

  useEffect(() => {
    void fetchMiningStats();

    const intervalInSeconds = 1000 * 5;
    setInterval(() => {
      void fetchMiningStats();
    }, intervalInSeconds);
  }, []);

  useEffect(() => {
    void fetchMiningAverages().catch(() => {
      void fetchMiningAverages();
    });

    const intervalInSeconds = 1000 * 119;
    setInterval(() => {
      void fetchMiningAverages();
    }, intervalInSeconds);
  }, []);

  const isLoadingStats = useMemo(
    () => !Object.keys(miningStats ?? {}).length,
    [miningStats],
  );

  const isLoadingAverageStats = useMemo(
    () => !Object.keys(miningAverageStats ?? {}).length,
    [miningAverageStats],
  );

  const isValidHashrateAverage1h = useMemo(
    () => hashrate_average_1h >= 0,
    [hashrate_average_1h],
  );
  const isValidHashrateAverage7d = useMemo(
    () => hashrate_average_7d >= 0,
    [hashrate_average_7d],
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
              value={
                isValidHashrateAverage1h
                  ? formatLargeInteger(hashrate_average_1h)
                  : "-"
              }
              loading={isLoadingAverageStats}
              customClass={"w-1/2"}
            />
            <Card
              label={Labels.AVG_7D_HASHRATE}
              value={
                isValidHashrateAverage7d
                  ? formatLargeInteger(hashrate_average_7d)
                  : "-"
              }
              loading={isLoadingAverageStats}
              customClass={"w-1/2"}
            />
          </div>

          <Card
            label={Labels.BLOCKS_FOUND}
            value={pool_blocks_found?.toLocaleString()}
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
            value={connected_miners.toLocaleString()}
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
            value={monero_network_difficulty.toLocaleString()}
            loading={isLoadingStats}
          />
          <div className="flex mt-4 gap-4 text-gray-50 text-xs underline">
            <Link href={QUBIC_XMR_STATS_URL.replace("/stats", "")}>
              Live data
            </Link>
          </div>
        </main>
      </div>
    </>
  );
};

export default MiningStats;
