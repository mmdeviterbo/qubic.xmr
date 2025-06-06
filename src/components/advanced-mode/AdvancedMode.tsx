import { memo, type FC } from "react";

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

import useBreakpoints from "@/hooks/useBreakpoints";
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

const AdvancedMode: FC<AdvancedModeProps> = ({
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
  } = miningStats ?? {};

  const {
    daily_blocks_found,
    epoch_blocks_found,
    epoch,
    max_hashrate,
    max_hashrate_last_update,
    historyCharts: { blocks_found_chart, max_hashrates_chart } = {},
  } = calculatedMiningStats ?? {};

  const { isXs } = useBreakpoints();

  useConfettiBlocksFound(pool_blocks_found);

  return (
    <main className="w-full flex flex-col gap-16 lg:w-2/3 xl:w-[60%] px-2 md:px-12 py-32">
      <div className="ml-1 md:ml-0 md:mb-2">
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
            isXs,
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
        title={Labels.BLOCKS_FOUND}
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
            id="blocks-found-bar-chart"
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

export default memo<AdvancedModeProps>(AdvancedMode);
