import { type FC } from "react";

import QubicLogo from "../common/logos/QubicLogo";
import Card from "./Card";
import CardSolo from "./CardSolo";
import Footer from "../footer/Footer";
import { SuperCfbToken } from "../common/sponsor/cfb/CfbToken";

import { CalculatedMiningStats, MiningStats } from "@/types/MiningStats";

import { useConfettiBlocksFound } from "@/hooks/useConfettiBlocksFound";
import { Labels } from "@/utils/constants";
import {
  formatLargeInteger,
  isWarningBounceForPoolBlocksFounds,
} from "@/utils/numbers";
import { isValidValue } from "@/utils/numbers";
import {
  formatLatestBlockFoundSubValue,
  formatPeakHashrateDateDifference,
  formatPoolBlocksFoundSubValue,
  formatPoolHashrateSubValue,
} from "@/utils/transformers";
import useBreakpoints from "@/hooks/useBreakpoints";

export interface SimpleModeProps {
  miningStats: MiningStats;
  isLoadingMiningStats: boolean;
  calculatedMiningStats: CalculatedMiningStats;
  isLoadingCalculatedMiningStats: boolean;
}

const SimpleMode: FC<SimpleModeProps> = ({
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
    network_difficulty: monero_network_difficulty,
  } = miningStats ?? {};

  const {
    daily_blocks_found,
    epoch_blocks_found,
    epoch,
    max_hashrate,
    max_hashrate_last_update,
    max_hashrate_last_epoch,
  } = calculatedMiningStats ?? {};

  // const [isSuperCfb, setIsSuperCfb] = useState<boolean>();

  // useLayoutEffect(() => {
  //   setIsSuperCfb(localStorage.getItem(cfbTokenStorageId) === "true");
  // }, [isLoadingMiningStats]);

  // const customCFBToken = useMemo(() => {
  //   if (isLoadingMiningStats || isUndefined(isSuperCfb)) {
  //     return null;
  //   }
  //   return isSuperCfb ? <SuperCfbToken /> : <CfbToken />;
  // }, [isLoadingMiningStats, isSuperCfb]);

  const { isXs } = useBreakpoints();

  useConfettiBlocksFound(pool_blocks_found);

  return (
    <main className="w-full flex flex-col gap-16 lg:w-2/3 xl:w-1/3 px-12 py-32">
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
        loading={isLoadingMiningStats}
        toolTip={"Percentage of pool hashrate over Monero's network hashrate"}
        toolTipLeftPosition={false}
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
      <div className="relative w-full flex gap-16">
        <CardSolo
          index={0}
          label={Labels.PEAK_HASHRATE}
          value={
            isLoadingCalculatedMiningStats
              ? ""
              : formatLargeInteger(max_hashrate)
          }
          subValue={
            max_hashrate_last_update ? (
              <div className="flex flex-col sm:flex-row items-center justify-center flex-wrap gap-0 sm:gap-2 text-14 sm:text-16 md:text-base">
                {formatPeakHashrateDateDifference(
                  max_hashrate_last_update,
                  max_hashrate_last_epoch,
                )?.map((v, i) => (
                  <p key={i} className={`${i === 1 ? "hidden sm:block" : ""}`}>
                    {v}
                  </p>
                ))}
              </div>
            ) : (
              ""
            )
          }
          loading={isLoadingCalculatedMiningStats}
          customClass="w-1/2"
        />

        <div className="flex flex-col gap-16 w-1/2">
          <Card
            label={Labels.AVG_1H_HASHRATE}
            value={formatLargeInteger(hashrate_average_1h)}
            loading={isLoadingMiningStats}
          />
          <Card
            label={Labels.AVG_7D_HASHRATE}
            value={formatLargeInteger(hashrate_average_7d)}
            loading={isLoadingMiningStats}
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
          loading={isLoadingMiningStats}
          customClass="w-1/2"
          properties={{
            bounce: isWarningBounceForPoolBlocksFounds(pool_blocks_found),
          }}
        />

        <div className="flex flex-col gap-16 w-1/2">
          <Card
            label={
              isXs ? Labels.DAILY_BLOCKS_FOUND_SHORT : Labels.DAILY_BLOCKS_FOUND
            }
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
            loading={isLoadingCalculatedMiningStats}
          />
          <Card
            label={(isXs
              ? Labels.EPOCH_BLOCKS_FOUND_SHORT
              : Labels.EPOCH_BLOCKS_FOUND
            ).replace(
              "<number>",
              isLoadingCalculatedMiningStats || epoch <= 0
                ? ""
                : epoch?.toString(),
            )}
            value={
              isValidValue(epoch_blocks_found)
                ? epoch_blocks_found?.toLocaleString()
                : "-"
            }
            toolTip={
              "Blocks found per epoch reset every Wednesday at 12:00 UTC"
            }
            loading={isLoadingCalculatedMiningStats}
          />
        </div>
      </div>

      <Card
        label={Labels.MONERO_NETWORK_HASHRATE}
        value={formatLargeInteger(monero_network_hashrate)}
        loading={isLoadingMiningStats}
        customClass="mt-4"
      />
      <Card
        label={Labels.MONERO_NETWORK_DIFFICULTY}
        value={
          isValidValue(monero_network_difficulty)
            ? monero_network_difficulty.toLocaleString()
            : "-"
        }
        loading={isLoadingMiningStats}
      />
      <Footer />
    </main>
  );
};

export default SimpleMode;
