import { useEffect, useMemo, useState } from "react";
import { NextPage } from "next";
import { Analytics } from "@vercel/analytics/next";

import Link from "next/link";
import Head from "next/head";
import axios from "axios";

import QubicLogo from "@/components/logos/QubicLogo";
import Card from "@/components/Card";

import type { MiningStats } from "@/types/MiningStats";
import { QUBIC_XMR_STATS_URL } from "@/utils/constants";
import {
  formatLatestBlockFound,
  formatPoolBlocksFoundSubValue,
  formatPoolHashrateSubValue,
} from "@/utils/transformers";
import { formatLargeInteger, isValidPositiveNumber } from "@/utils/numbers";

const MiningStats: NextPage = () => {
  const [miningStats, setMiningStats] = useState<MiningStats>();

  const {
    highest_pool_hashrate = 0,
    pool_hashrate = 0,
    pool_blocks_found = 0,
    connected_miners = 0,
    last_block_found = 0,
    network_hashrate: monero_network_hashrate = 0,
    network_height: monero_network_height = 0,
    network_difficulty: monero_network_difficulty = 0,
  } = miningStats ?? {};

  const fetchMiningStats = async () => {
    let stats = (await axios.get("/api")).data;
    setMiningStats(stats);
  };

  useEffect(() => {
    const intervalInSeconds = 1000 * 5;
    void fetchMiningStats();
    setInterval(() => {
      void fetchMiningStats();
    }, intervalInSeconds);
  }, []);

  const isLoading = useMemo(
    () => !Object.keys(miningStats ?? {}).length,
    [miningStats],
  );

  return (
    <>
      <Analytics />

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
            label={"Pool Hashrate"}
            value={formatLargeInteger(pool_hashrate)}
            subValue={formatPoolHashrateSubValue(
              pool_hashrate,
              monero_network_hashrate,
            )}
            loading={isLoading}
          />
          {isValidPositiveNumber(highest_pool_hashrate) && (
            <Card
              label={"Peak Pool Hashrate"}
              value={formatLargeInteger(highest_pool_hashrate)}
              toolTip={
                "Recorded highest hashrate starting May 18, 2025 6:15AM UTC"
              }
              loading={isLoading}
            />
          )}
          <Card
            label={"Pool Blocks Found"}
            value={pool_blocks_found?.toLocaleString()}
            subValue={formatPoolBlocksFoundSubValue(pool_blocks_found)}
            toolTip={"One block is approximately equivalent to 0.60 XMR"}
            loading={isLoading}
          />
          <Card
            label={"Last Block Found"}
            value={formatLatestBlockFound(last_block_found)}
            loading={isLoading}
          />
          <Card
            label={"Connected Miners"}
            value={connected_miners.toLocaleString()}
            loading={isLoading}
          />

          <Card
            label={"Monero Network Hashrate"}
            value={formatLargeInteger(monero_network_hashrate)}
            loading={isLoading}
            customClass="mt-6"
          />
          <Card
            label={"Monero Network Height"}
            value={formatLargeInteger(monero_network_height)}
            loading={isLoading}
          />
          <Card
            label={"Monero Network Difficulty"}
            value={formatLargeInteger(monero_network_difficulty)}
            loading={isLoading}
          />

          <div className="flex mt-4 gap-4 text-gray-50 text-xs">
            <Link href={QUBIC_XMR_STATS_URL}>Live data</Link>
          </div>
        </main>
      </div>
    </>
  );
};

export default MiningStats;
