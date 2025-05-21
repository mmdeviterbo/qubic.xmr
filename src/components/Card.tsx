import { FC, ReactNode } from "react";
import Tooltip from "./Tooltip";
import { Labels } from "@/utils/constants";

interface CardProps {
  label: string;
  value: ReactNode;
  subValue?: string;
  loading: boolean;
  toolTip?: string;
  customClass?: string;
}

const Card: FC<CardProps> = ({
  label,
  value,
  subValue = "",
  loading,
  toolTip,
  customClass = "",
}) => {
  return (
    <div
      className={`${customClass} flex flex-col gap-8 rounded-12 px-24 py-16 ${loading ? "animate-pulse bg-gray-800 h-22" : "border-1 border-primary-60 bg-primary-70"}`}
    >
      <div className="flex items-center gap-2">
        <span className="font-space text-14 text-gray-50">{label}</span>
        {toolTip && <Tooltip content={toolTip} />}
      </div>

      <div className="flex items-center">
        <p className="whitespace-nowrap font-space text-18 sm:text-22">
          {loading ? "" : value}
        </p>
        {subValue && (
          <span className="ml-2 font-space text-gray-50">
            {loading ? "" : subValue}
          </span>
        )}
      </div>
    </div>
  );
};

export default Card;
