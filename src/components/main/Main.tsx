import { memo, useMemo, type FC, type ReactNode } from "react";

import QubicLogo from "../common/logos/QubicLogo";
import Card from "./Card";
import ChartContainer from "./ChartContainer";
import BarChart from "./BlocksFoundChart";
import MaxHashratesChart from "./MaxHashratesChart";
import Footer from "../footer/Footer";
import { SuperCfbToken } from "../common/sponsor/cfb/CfbToken";

import type { CalculatedMiningStats, MiningStats } from "@/types/MiningStats";
import {
  formatLatestBlockFoundSubValue,
  formatPeakHashrateDateDifference,
  formatPoolBlocksFoundSubValue,
  formatPoolHashrateSubValue,
} from "@/utils/transformers";

import { useConfettiBlocksFound } from "@/hooks/useConfettiBlocksFound";
import { Labels } from "@/utils/constants";
import {
  formatLargeInteger,
  isWarningBounceForPoolBlocksFounds,
} from "@/utils/numbers";
import { isValidValue } from "@/utils/numbers";

export interface AdvancedModeProps {
  miningStats: MiningStats;
  isLoadingMiningStats: boolean;
  calculatedMiningStats: CalculatedMiningStats;
  isLoadingCalculatedMiningStats: boolean;
}

const Main: FC<AdvancedModeProps> = ({
  miningStats,
  isLoadingMiningStats,
  calculatedMiningStats,
  isLoadingCalculatedMiningStats,
}) => {
  const {
    pool_hashrate,
    pool_blocks_found,
    last_block_found,
    hashrate_average_1h,
    hashrate_average_7d,
    connected_miners,
    network_hashrate: monero_network_hashrate,
    pool_hashrate_ranking,
  } = miningStats ?? {};

  const {
    daily_blocks_found,
    epoch_blocks_found,
    epoch,
    max_hashrate,
    max_hashrate_last_update,
    historyCharts: { blocks_found_chart, max_hashrates_chart } = {},
  } = calculatedMiningStats ?? {};

  useConfettiBlocksFound(pool_blocks_found);

  const hashrateRanking = useMemo<ReactNode>(() => {
    return (
      <div className="flex items-center gap-1">
        {isValidValue(pool_hashrate, false) && (
          <>
            <span>Rank {pool_hashrate_ranking}</span>
            <span>•</span>
          </>
        )}
        <span>
          {formatPoolHashrateSubValue(pool_hashrate, monero_network_hashrate)}
        </span>
      </div>
    );
  }, [pool_hashrate_ranking, pool_hashrate, monero_network_hashrate]);

  return (
    <main className="w-full flex flex-col gap-4 lg:w-2/3 xl:w-[55%] px-3 md:px-12 py-8">
      <div className="ml-2 md:ml-1 md:mb-2">
        <QubicLogo showTitle={true} />
      </div>

      <Card
        index={0}
        label={Labels.HASHRATE}
        value={formatLargeInteger(pool_hashrate)}
        subValue={hashrateRanking}
        loading={isLoadingMiningStats}
        properties={{
          isOnline: connected_miners > 0 && pool_blocks_found > 0,
          cfbToken: (
            <SuperCfbToken
              showFire={
                isValidValue(pool_hashrate) && isValidValue(max_hashrate, false)
                  ? pool_hashrate >= max_hashrate
                  : false
              }
            />
          ),
        }}
      />

      <ChartContainer
        title={Labels.HASHRATE_PERFORMANCE}
        leftSubtitle={{
          label: formatPeakHashrateDateDifference(
            max_hashrate_last_update,
          ).join(""),
          value: isLoadingCalculatedMiningStats
            ? ""
            : formatLargeInteger(max_hashrate),
        }}
        loading={isLoadingMiningStats}
        rightSubtitles={[
          {
            label: Labels.AVG_1H_HASHRATE,
            value: formatLargeInteger(hashrate_average_1h),
          },
          {
            label: Labels.AVG_7D_HASHRATE,
            value: formatLargeInteger(hashrate_average_7d),
          },
        ]}
        chart={
          <MaxHashratesChart
            id="hashrate-line-chart"
            max_hashrates_chart={max_hashrates_chart}
            loading={isLoadingCalculatedMiningStats}
          />
        }
      />

      <ChartContainer
        title={"XMR ".concat(Labels.BLOCKS_FOUND)}
        leftSubtitle={{
          label: formatLatestBlockFoundSubValue(last_block_found),
          sublabel: formatPoolBlocksFoundSubValue(pool_blocks_found),
          value: isValidValue(pool_blocks_found, false)
            ? pool_blocks_found?.toLocaleString()
            : "-",
          properties: {
            bounce: isWarningBounceForPoolBlocksFounds(pool_blocks_found),
          },
        }}
        rightSubtitles={[
          {
            label: Labels.DAILY_BLOCKS_FOUND,
            value: isValidValue(daily_blocks_found)
              ? daily_blocks_found?.toLocaleString()
              : "-",
          },
          {
            label: Labels.EPOCH_BLOCKS_FOUND.replace(
              "<number>",
              isLoadingCalculatedMiningStats || !isValidValue(epoch, false)
                ? ""
                : epoch?.toString(),
            ),
            value: isValidValue(epoch_blocks_found)
              ? epoch_blocks_found?.toLocaleString()
              : "-",
          },
        ]}
        loading={isLoadingCalculatedMiningStats}
        chart={
          <BarChart
            id="xmr-blocks-found-bar-chart"
            blocks_found_chart={blocks_found_chart}
            loading={isLoadingCalculatedMiningStats}
          />
        }
      />
      <Card
        label={Labels.MONERO_NETWORK_HASHRATE}
        value={formatLargeInteger(monero_network_hashrate)}
        loading={isLoadingMiningStats}
      />
      <Footer />
    </main>
  );
};

export default memo<AdvancedModeProps>(Main);
