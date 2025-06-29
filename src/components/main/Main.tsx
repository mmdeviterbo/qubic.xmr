import { memo, useMemo, type FC, type ReactNode } from "react";
import dynamic from "next/dynamic";

import maxBy from "lodash/maxBy";

import ChartContainer from "@/components/common/ChartContainer";
import BlocksChart from "@/components/main/BlocksChart";
import DistributionChart from "@/components/main/DistributionChart";
import MaxHashratesChart from "@/components/main/MaxHashratesChart";
import QubicLogo from "@/components/common/logos/QubicLogo";
import Card from "@/components/common/Card";
import Tab from "@/components/common/Tab";

const CfbPost = dynamic(
  () => import("@/components/common/sponsor/cfb/CfbPost"),
  { ssr: false },
);

const CfbToken = dynamic(
  () => import("@/components/common/sponsor/cfb/CfbToken"),
  { ssr: false },
);

const CfbMarquee = dynamic(
  () => import("@/components/common/sponsor/cfb/CfbMarquee"),
  { ssr: false },
);

import type { MiningStats, XTMHistoryCharts } from "@/types/MiningStats";
import { type AdvanceMiningCharts } from "@/types/MiningStats";
import {
  formatLatestBlockFoundSubValue,
  formatPeakHashrateDateDifference,
  formatMoneroBlocksFoundSubValue,
  formatPoolHashrateSubValue,
  formatTariBlocksFoundSubValue,
} from "@/utils/transformers";

import { Labels } from "@/utils/constants";
import { formatHashrate } from "@/utils/numbers";
import { isValidValue } from "@/utils/numbers";

export interface MainProps {
  miningStats: MiningStats;
  isLoadingMiningStats: boolean;

  advanceMiningStats: AdvanceMiningCharts;
  isLoadingAdvanceMiningStats: boolean;

  calculatedXTMMiningStats: XTMHistoryCharts;
  isLoadingCalculatedXTMMiningStats: boolean;
}

const Main: FC<MainProps> = ({
  //basic stats
  miningStats,
  isLoadingMiningStats,

  //xmr
  advanceMiningStats,
  isLoadingAdvanceMiningStats,

  //xtm
  calculatedXTMMiningStats,
  isLoadingCalculatedXTMMiningStats,
}) => {
  const {
    pool_hashrate,
    pool_hashrate_ranking,
    network_hashrate: monero_network_hashrate,
    monero_blocks_found: { last_block_found, pool_blocks_found } = {},
    hashrate_averages: { hashrate_average_1h, hashrate_average_7d } = {},
    monero_block_distributions,
  } = miningStats ?? {};

  const { blocksChart: moneroBlocksChart, hashratesChart } =
    advanceMiningStats ?? {};

  const {
    tari_blocks_found,
    blocks_found_chart: tari_history_charts,
    tari_block_distributions,
  } = calculatedXTMMiningStats ?? {};

  const monero_daily_blocks_found = useMemo(
    () => moneroBlocksChart?.daily?.at(-1).blocks_found,
    [moneroBlocksChart?.daily?.at(-1)],
  );
  const monero_weekly_blocks_found = useMemo(
    () => moneroBlocksChart?.weekly?.at(-1).blocks_found,
    [moneroBlocksChart?.weekly?.at(-1)],
  );

  const tari_daily_blocks_found = useMemo(
    () => tari_history_charts?.daily?.at(-1).blocks_found,
    [tari_history_charts?.daily?.at(-1)],
  );
  const tari_weekly_blocks_found = useMemo(
    () => tari_history_charts?.weekly?.at(-1).blocks_found,
    [tari_history_charts?.weekly?.at(-1)],
  );

  const highestHashrate = useMemo(() => {
    return maxBy(hashratesChart, "max_hashrate");
  }, [hashratesChart]);

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

  const epochLabel = useMemo(() => {
    const latestEpoch = moneroBlocksChart?.weekly?.at(-1)?.epoch;
    return Labels.EPOCH_BLOCKS_FOUND.replace(
      "<number>",
      isLoadingAdvanceMiningStats || !isValidValue(latestEpoch, false)
        ? ""
        : latestEpoch?.toString(),
    );
  }, [moneroBlocksChart?.weekly, isLoadingAdvanceMiningStats]);

  return (
    <>
      <div className="z-100">
        <QubicLogo showTitle={true} />
      </div>

      <div className="flex flex-col">
        <Card
          label={Labels.HASHRATE}
          value={formatHashrate(pool_hashrate)}
          subValue={hashrateRanking}
          loading={isLoadingMiningStats}
          properties={{
            cfbToken: <CfbToken />,
          }}
        />

        {/* <CfbPost /> */}

        <CfbMarquee />

        <ChartContainer
          title={Labels.HASHRATE_PERFORMANCE}
          leftSubtitle={{
            label: formatPeakHashrateDateDifference(
              highestHashrate?.timestamp,
            ).join(""),
            value: isLoadingAdvanceMiningStats
              ? ""
              : formatHashrate(highestHashrate?.max_hashrate),
          }}
          loading={false}
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
              max_hashrates_chart={hashratesChart}
              loading={isLoadingAdvanceMiningStats}
            />
          }
        />
      </div>

      <ChartContainer
        title={"Monero ".concat(Labels.BLOCKS)}
        leftSubtitle={{
          label: formatLatestBlockFoundSubValue(last_block_found),
          sublabel: formatMoneroBlocksFoundSubValue(pool_blocks_found),
          value: isValidValue(pool_blocks_found, false)
            ? pool_blocks_found?.toLocaleString()
            : "-",
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
        loading={isLoadingAdvanceMiningStats || isLoadingMiningStats}
        chart={
          <Tab
            tabs={[
              {
                label: Labels.BLOCKS_FOUND,
                child: (
                  <BlocksChart
                    id="monero-blocks-bar-chart"
                    blocks_found_chart={moneroBlocksChart}
                    loading={isLoadingAdvanceMiningStats}
                  />
                ),
              },
              {
                label: Labels.BLOCKS_DISTRIBUTION,
                child: (
                  <DistributionChart
                    id="monero-distribution-chart"
                    block_distributions={monero_block_distributions}
                    loading={isLoadingMiningStats}
                  />
                ),
              },
            ]}
          />
        }
      />

      <ChartContainer
        title={"Tari ".concat(Labels.BLOCKS)}
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
        loading={isLoadingCalculatedXTMMiningStats}
        chart={
          <Tab
            tabs={[
              {
                label: Labels.BLOCKS_FOUND,
                child: (
                  <BlocksChart
                    id="tari-blocks-bar-chart"
                    blocks_found_chart={tari_history_charts}
                    loading={isLoadingCalculatedXTMMiningStats}
                  />
                ),
              },
              {
                label: Labels.BLOCKS_DISTRIBUTION,
                child: (
                  <DistributionChart
                    id="tari-distribution-chart"
                    block_distributions={tari_block_distributions}
                    loading={isLoadingCalculatedXTMMiningStats}
                  />
                ),
              },
            ]}
          />
        }
      />
    </>
  );
};

export default memo<MainProps>(Main);
