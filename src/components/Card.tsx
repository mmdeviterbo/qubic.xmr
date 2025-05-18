import { FC } from "react";

interface CardProps {
  label: string;
  value: string;
  subValue?: string;
  loading: boolean;
  customClass?: string;
}

const Card: FC<CardProps> = ({
  label,
  value,
  subValue = "",
  loading,
  customClass = "",
}) => {
  return (
    <div
      className={`${customClass} flex flex-col gap-8 rounded-12 px-24 py-16 ${loading ? "animate-pulse bg-gray-800 h-22" : "border-1 border-primary-60 bg-primary-70"}`}
    >
      <p className="font-space text-14 text-gray-50">{label}</p>
      <div className="flex items-center">
        <p className="font-space text-18 xs:text-24 sm:text-22">
          {loading ? "" : value}
        </p>
        {subValue && (
          <span className="ml-2 font-space text-gray-50 text-18">
            {loading ? "" : subValue}
          </span>
        )}
      </div>
    </div>
  );
};

export default Card;
