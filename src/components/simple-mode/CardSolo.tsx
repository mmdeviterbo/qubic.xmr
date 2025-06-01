import { memo, type FC, type ReactNode } from "react";
import Tooltip from "../common/Tooltip";

interface CardProps {
  index?: number;
  label: string;
  value: ReactNode;
  subValue?: ReactNode;
  loading: boolean;
  toolTip?: string;
  customClass?: string;
  properties?: {
    bounce?: boolean;
    confetti?: boolean;
  };
}

const Card: FC<CardProps> = ({
  index,
  label,
  value,
  subValue = null,
  loading,
  toolTip,
  customClass = "",
  properties,
}) => {
  return (
    <div
      className={`${customClass} flex flex-col gap-8 rounded-12 px-24 py-16 border-1 border-primary-60 bg-primary-70`}
    >
      <div className="flex items-center gap-2">
        <span className="font-space text-14 text-gray-50">{label}</span>
        {toolTip && <Tooltip content={toolTip} leftPosition={false} />}
      </div>

      <div
        className={`flex flex-col text-center items-center justify-center h-full`}
      >
        {loading ? (
          <>
            <div className="animate-pulse w-2/3 h-6 rounded-lg bg-gray-800 mb-3" />
            <div className="animate-pulse w-1/3 h-4 rounded-lg bg-gray-800" />
          </>
        ) : (
          <>
            <p
              className={`${properties?.bounce ? "animate-bounce" : ""} font-space ${index === 0 ? "text-lg xs:text-xl sm:text-2xl" : "text-xl xs:text-2xl sm:text-3xl"} grid place-items-center`}
            >
              {value}
            </p>
            <div className="font-space text-base text-gray-50">
              {loading ? "" : subValue}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default memo<CardProps>(Card);
