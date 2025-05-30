import { memo, type FC, type ReactNode } from "react";
import Tooltip from "@/components/common/Tooltip";
import CfbToken from "@/components/common/sponsor/cfb/CfbToken";

interface CardProps {
  index?: number;
  label: string;
  value: ReactNode;
  subValue?: string;
  loading: boolean;
  toolTip?: string;
  toolTipLeftPosition?: boolean;
  customClass?: string;
  properties?: {
    isOnline?: boolean;
  };
}

const AnimationPing: FC<{ isOnline?: boolean }> = ({ isOnline }) => {
  return (
    <span className="relative flex size-2">
      {isOnline && (
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75" />
      )}
      <span
        className={`relative inline-flex size-2 rounded-full ${isOnline ? "bg-sky-200" : "bg-red-500"}`}
      />
    </span>
  );
};

const Card: FC<CardProps> = ({
  index,
  label,
  value,
  subValue = "",
  loading,
  toolTip,
  toolTipLeftPosition = true,
  customClass = "",
  properties,
}) => {
  return (
    <div
      className={`${customClass} relative flex flex-col gap-8 rounded-12 px-24 py-16 ${loading ? "animate-pulse bg-gray-800 h-22" : "border-1 border-primary-60 bg-primary-70"}`}
    >
      {index === 0 && <CfbToken />}

      <div className="flex items-center gap-2">
        <span className="font-space text-14 text-gray-50">{label}</span>
        {index === 0 ? (
          <AnimationPing isOnline={properties?.isOnline} />
        ) : (
          toolTip && (
            <Tooltip content={toolTip} leftPosition={toolTipLeftPosition} />
          )
        )}
      </div>

      <div className="flex items-center">
        <p
          className={`whitespace-nowrap font-space ${index !== 0 ? "text-16" : ""} xs:text-18 sm:text-22`}
        >
          {loading ? "" : value}
        </p>
        {subValue && (
          <span className="ml-2 font-space text-sm text-gray-50">
            {loading ? "" : subValue}
          </span>
        )}
      </div>
    </div>
  );
};

export default memo<CardProps>(Card);
