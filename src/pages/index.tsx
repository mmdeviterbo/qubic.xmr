import { useCallback, useEffect, useMemo, useState } from "react";
import { Analytics } from "@vercel/analytics/next";
import type { NextPage } from "next";
import isEmpty from "lodash/isEmpty";

import Head from "next/head";
import axios from "axios";
import QubicLogo from "@/components/common/logos/QubicLogo";
import Card from "@/components/common/Card";

import type { MiningStats } from "@/types/MiningStats";
import { Labels } from "@/utils/constants";
import {
  formatLatestBlockFoundSubValue,
  formatPeakHashrateDate,
  formatPoolBlocksFoundSubValue,
  formatPoolHashrateSubValue,
  isValidValue,
} from "@/utils/transformers";
import { formatLargeInteger } from "@/utils/numbers";
import Footer from "@/components/footer/Footer";
import CardSolo from "@/components/common/CardSolo";

const Main: NextPage<{
  miningStatsProps?: MiningStats;
}> = ({ miningStatsProps }) => {
  const [miningStats, setMiningStats] = useState<MiningStats>(miningStatsProps);

  const [history, setHistory] =
    useState<
      Pick<
        MiningStats,
        | "daily_blocks_found"
        | "epoch_blocks_found"
        | "epoch"
        | "hashrate_average_1h"
        | "max_hashrate"
        | "max_hashrate_last_update"
      >
    >(miningStatsProps);

  const {
    pool_hashrate,
    pool_blocks_found,
    last_block_found,
    hashrate_average_7d,
    connected_miners,
    network_hashrate: monero_network_hashrate,
    network_difficulty: monero_network_difficulty,
  } = miningStats ?? {};

  const {
    daily_blocks_found,
    epoch_blocks_found,
    epoch,
    hashrate_average_1h,
    max_hashrate,
    max_hashrate_last_update,
  } = history ?? {};

  const fetchQubicMiningHistory = useCallback(async () => {
    const response = await axios.get("/api/calculated-stats");
    if (response?.status === 200) {
      setHistory(response.data);
    }
  }, []);

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

  useEffect(() => {
    if (!hashrate_average_1h) {
      void fetchQubicMiningHistory();
    }
    setInterval(() => {
      void fetchQubicMiningHistory();
    }, 90000); //90sec / 1.5min
  }, []);

  const isLoadingStats = useMemo(() => isEmpty(miningStats), [miningStats]);
  const isLoadingHistory = useMemo(() => isEmpty(history), [history]);

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
            index={0}
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
            toolTipLeftPosition={false}
            properties={{
              isOnline: connected_miners > 0 && pool_blocks_found > 0,
            }}
          />
          <div className="relative w-full flex gap-16">
            <CardSolo
              index={0}
              label={Labels.PEAK_HASHRATE}
              value={isLoadingHistory ? "" : formatLargeInteger(max_hashrate)}
              subValue={
                max_hashrate_last_update
                  ? formatPeakHashrateDate(max_hashrate_last_update)
                  : ""
              }
              loading={isLoadingHistory}
              customClass="w-1/2"
            />

            <div className="flex flex-col gap-16 w-1/2">
              <Card
                label={Labels.AVG_1H_HASHRATE}
                value={formatLargeInteger(hashrate_average_1h)}
                loading={isLoadingHistory}
              />
              <Card
                label={Labels.AVG_7D_HASHRATE}
                value={formatLargeInteger(hashrate_average_7d)}
                loading={isLoadingStats}
              />
            </div>
          </div>

          <div className="relative w-full flex gap-16">
            <CardSolo
              label={Labels.BLOCKS_FOUND}
              value={
                isValidValue(pool_blocks_found, false)
                  ? pool_blocks_found?.toLocaleString()
                  : "-"
              }
              subValue={formatPoolBlocksFoundSubValue(pool_blocks_found)}
              toolTip={"One block is approximately equivalent to 0.60 XMR"}
              loading={isLoadingStats}
              customClass="w-1/2"
            />

            <div className="flex flex-col gap-16 w-1/2">
              <Card
                label={Labels.DAILY_BLOCKS_FOUND}
                value={
                  isValidValue(daily_blocks_found)
                    ? daily_blocks_found?.toLocaleString()
                    : "-"
                }
                toolTip={"Daily blocks found reset at 12:00 UTC"}
                subValue={
                  daily_blocks_found > 0
                    ? formatLatestBlockFoundSubValue(last_block_found)
                    : ""
                }
                loading={isLoadingHistory}
              />
              <Card
                label={Labels.EPOCH_BLOCKS_FOUND.replace(
                  "<number>",
                  isLoadingHistory || epoch <= 0 ? "" : epoch?.toString(),
                )}
                value={
                  isValidValue(epoch_blocks_found)
                    ? epoch_blocks_found?.toLocaleString()
                    : "-"
                }
                toolTip={
                  "Blocks found per epoch reset every Wednesday at 12:00 UTC"
                }
                loading={isLoadingHistory}
              />
            </div>
          </div>

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
