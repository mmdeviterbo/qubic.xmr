import { FC, memo } from "react";
import QubicLogo from "../common/logos/QubicLogo";
import Card from "../simple-mode/Card";
import { formatLargeInteger, isValidValue } from "@/utils/numbers";
import { formatPoolHashrateSubValue } from "@/utils/transformers";
import { SimpleModeProps } from "../simple-mode/SimpleMode";
import { Labels } from "@/utils/constants";
import { SuperCfbToken } from "../common/sponsor/cfb/CfbToken";

type AdvancedModeProps = SimpleModeProps;

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

  return (
    <main className="w-full flex flex-col gap-16 px-4 lg:w-2/3 xl:w-1/3 py-32">
      <div className="md:mb-2 px-2">
        <QubicLogo showTitle={true} />
      </div>

      <div className="pl-2">
        <p className="font-space text-lg text-gray-50">{Labels.HASHRATE}</p>
        <p className="text-3xl lg:text-4xl font-bold">
          {formatLargeInteger(pool_hashrate)}
        </p>

        <span className="text-sm text-gray-50">
          {formatPoolHashrateSubValue(
            pool_hashrate,
            monero_network_hashrate,
          ).replace("≈", "")}
        </span>
      </div>

      {/* <div className="border relative">

        
      </div> */}
    </main>
  );
};

export default memo<AdvancedModeProps>(AdvancedMode);
