import { FC, useMemo } from "react";
import isEmpty from "lodash/isEmpty";

import QubicLogo from "../common/logos/QubicLogo";
import Card from "../common/Card";
import CardSolo from "../common/CardSolo";
import Footer from "../footer/Footer";

import { CalculatedMiningStats, MiningStats } from "@/types/MiningStats";
import { Labels } from "@/utils/constants";
import { formatLargeInteger } from "@/utils/numbers";
import { isValidValue } from "@/utils/numbers";
import {
  formatLatestBlockFoundSubValue,
  formatPeakHashrateDate,
  formatPoolBlocksFoundSubValue,
  formatPoolHashrateSubValue,
} from "@/utils/transformers";

interface SimpleModeProps {
  miningStats: MiningStats;
  calculatedMiningStats: CalculatedMiningStats;
}

const SimpleMode: FC<SimpleModeProps> = ({
  miningStats,
  calculatedMiningStats,
}) => {
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
  } = calculatedMiningStats ?? {};

  const isLoadingStats = useMemo(() => isEmpty(miningStats), [miningStats]);
  const isLoadingCalculatedStats = useMemo(
    () => isEmpty(calculatedMiningStats),
    [calculatedMiningStats],
  );

  return (
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
        toolTip={"Percentage of pool hashrate over Monero's network hashrate"}
        toolTipLeftPosition={false}
        properties={{
          isOnline: connected_miners > 0 && pool_blocks_found > 0,
        }}
      />
      <div className="relative w-full flex gap-16">
        <CardSolo
          index={0}
          label={Labels.PEAK_HASHRATE}
          value={
            isLoadingCalculatedStats ? "" : formatLargeInteger(max_hashrate)
          }
          subValue={
            max_hashrate_last_update
              ? formatPeakHashrateDate(max_hashrate_last_update)
              : ""
          }
          loading={isLoadingCalculatedStats}
          customClass="w-1/2"
        />

        <div className="flex flex-col gap-16 w-1/2">
          <Card
            label={Labels.AVG_1H_HASHRATE}
            value={formatLargeInteger(hashrate_average_1h)}
            loading={isLoadingCalculatedStats}
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
            loading={isLoadingCalculatedStats}
          />
          <Card
            label={Labels.EPOCH_BLOCKS_FOUND.replace(
              "<number>",
              isLoadingCalculatedStats || epoch <= 0 ? "" : epoch?.toString(),
            )}
            value={
              isValidValue(epoch_blocks_found)
                ? epoch_blocks_found?.toLocaleString()
                : "-"
            }
            toolTip={
              "Blocks found per epoch reset every Wednesday at 12:00 UTC"
            }
            loading={isLoadingCalculatedStats}
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
  );
};

export default SimpleMode;
