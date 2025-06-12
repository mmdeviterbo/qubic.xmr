import { memo, type ReactElement, type FC, type ReactNode } from "react";

interface CardProps {
  index?: number;
  label: ReactNode;
  value: ReactNode;
  subValue?: ReactNode;
  loading: boolean;
  properties?: {
    isOnline?: boolean;
    cfbToken: ReactElement;
  };
}

const Card: FC<CardProps> = ({
  index,
  label,
  value,
  subValue,
  loading,
  properties,
}) => {
  return (
    <div className="relative flex flex-col gap-1 rounded-xl px-5 md:px-8 py-4 md:py-6 border-1 border-primary-60 bg-primary-70">
      {properties?.cfbToken}

      <div className="font-space text-sm text-gray-50">{label}</div>

      {loading ? (
        <div
          className={`animate-pulse ${index === 0 ? "w-1/3" : "sm:w-1/2 w-2/3"} my-1 h-4 rounded-xl bg-gray-800`}
        />
      ) : (
        <div className="flex flex-col">
          <p className={`whitespace-nowrap font-space text-lg md:text-2xl`}>
            {loading ? "" : value}
          </p>
          {subValue && (
            <div className="font-space text-xs text-gray-50">
              {loading ? "" : subValue}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default memo<CardProps>(Card);
