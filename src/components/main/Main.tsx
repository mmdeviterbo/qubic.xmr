import { memo, useMemo, type FC, type ReactNode } from "react";

import QubicLogo from "../common/logos/QubicLogo";
import Card from "../common/Card";
import ChartContainer from "../common/ChartContainer";
import BarChart from "./BlocksFoundChart";
import MaxHashratesChart from "./MaxHashratesChart";
import { SuperCfbToken } from "../common/sponsor/cfb/CfbToken";

import type { CalculatedMiningStats, MiningStats } from "@/types/MiningStats";
import {
  formatLatestBlockFoundSubValue,
  formatPeakHashrateDateDifference,
  formatMoneroBlocksFoundSubValue,
  formatPoolHashrateSubValue,
  formatTariBlocksFoundSubValue,
} from "@/utils/transformers";

import { useConfettiBlocksFound } from "@/hooks/useConfettiBlocksFound";
import { Labels } from "@/utils/constants";
import {
  formatHashrate,
  isWarningBounceForPoolBlocksFounds,
} from "@/utils/numbers";
import { isValidValue } from "@/utils/numbers";
import CfbMarquee from "../common/sponsor/cfb/CfbMarquee";

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
    pool_hashrate_ranking,
    network_hashrate: monero_network_hashrate,
    connected_miners,
    monero_blocks_found: { last_block_found, pool_blocks_found } = {},
    hashrate_averages: { hashrate_average_1h, hashrate_average_7d } = {},
    blockDistributions = {},
  } = miningStats ?? {};

  const {
    epoch,
    max_hashrate_stats: { max_hashrate, max_hashrate_last_update } = {},
    monero_history_charts: {
      blocks_found_chart: monero_blocks_found_chart,
      max_hashrates_chart,
    } = {},
    tari_blocks_found,
    tari_history_charts,
  } = calculatedMiningStats ?? {};

  const monero_daily_blocks_found = useMemo(
    () => monero_blocks_found_chart?.daily?.at(-1).blocks_found,
    [monero_blocks_found_chart?.daily?.at(-1)],
  );
  const monero_weekly_blocks_found = useMemo(
    () => monero_blocks_found_chart?.weekly?.at(-1).blocks_found,
    [monero_blocks_found_chart?.weekly?.at(-1)],
  );

  const tari_daily_blocks_found = useMemo(
    () => tari_history_charts?.daily?.at(-1).blocks_found,
    [tari_history_charts?.daily?.at(-1)],
  );
  const tari_weekly_blocks_found = useMemo(
    () => tari_history_charts?.weekly?.at(-1).blocks_found,
    [tari_history_charts?.weekly?.at(-1)],
  );

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

  const epochLabel = useMemo(
    () =>
      Labels.EPOCH_BLOCKS_FOUND.replace(
        "<number>",
        isLoadingCalculatedMiningStats || !isValidValue(epoch, false)
          ? ""
          : epoch?.toString(),
      ),
    [epoch, isLoadingCalculatedMiningStats],
  );

  return (
    <>
      <div className="ml-2 md:ml-1 md:mb-2">
        <QubicLogo showTitle={true} />
      </div>

      <Card
        index={0}
        label={Labels.HASHRATE}
        value={formatHashrate(pool_hashrate)}
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

      <CfbMarquee />

      <ChartContainer
        title={Labels.HASHRATE_PERFORMANCE}
        leftSubtitle={{
          label: formatPeakHashrateDateDifference(
            max_hashrate_last_update,
          ).join(""),
          value: isLoadingCalculatedMiningStats
            ? ""
            : formatHashrate(max_hashrate),
        }}
        loading={isLoadingMiningStats}
        rightSubtitles={[
          {
            label: Labels.AVG_1H_HASHRATE,
            value: formatHashrate(hashrate_average_1h),
          },
          {
            label: Labels.AVG_7D_HASHRATE,
            value: formatHashrate(hashrate_average_7d),
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
        title={"Monero ".concat(Labels.BLOCKS_FOUND)}
        leftSubtitle={{
          label: formatLatestBlockFoundSubValue(last_block_found),
          sublabel: formatMoneroBlocksFoundSubValue(pool_blocks_found),
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
            value: isValidValue(monero_daily_blocks_found)
              ? monero_daily_blocks_found?.toLocaleString()
              : "-",
          },
          {
            label: epochLabel,
            value: isValidValue(monero_weekly_blocks_found)
              ? monero_weekly_blocks_found?.toLocaleString()
              : "-",
          },
        ]}
        loading={isLoadingCalculatedMiningStats}
        chart={
          <BarChart
            id="monero-blocks-found-bar-chart"
            blocks_found_chart={monero_blocks_found_chart}
            loading={isLoadingCalculatedMiningStats}
          />
        }
      />

      <ChartContainer
        title={"Tari ".concat(Labels.BLOCKS_FOUND)}
        leftSubtitle={{
          label: formatLatestBlockFoundSubValue(
            tari_blocks_found?.last_block_found,
          ),
          sublabel: formatTariBlocksFoundSubValue(
            tari_blocks_found?.total_rewards,
          ),
          value: isValidValue(tari_blocks_found?.pool_blocks_found, false)
            ? tari_blocks_found?.pool_blocks_found?.toLocaleString()
            : "-",
        }}
        rightSubtitles={[
          {
            label: Labels.DAILY_BLOCKS_FOUND,
            value: isValidValue(tari_daily_blocks_found)
              ? tari_daily_blocks_found?.toLocaleString()
              : "-",
          },
          {
            label: epochLabel,
            value: isValidValue(tari_weekly_blocks_found)
              ? tari_weekly_blocks_found?.toLocaleString()
              : "-",
          },
        ]}
        loading={isLoadingCalculatedMiningStats}
        chart={
          <BarChart
            id="tari-blocks-found-bar-chart"
            blocks_found_chart={tari_history_charts}
            loading={isLoadingCalculatedMiningStats}
          />
        }
      />
    </>
  );
};

export default memo<AdvancedModeProps>(Main);
