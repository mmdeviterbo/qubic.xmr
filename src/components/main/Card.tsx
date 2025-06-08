import { memo, type ReactElement, type FC, type ReactNode } from "react";

interface CardProps {
  index?: number;
  label: string;
  value: ReactNode;
  subValue?: ReactNode;
  subValue2?: ReactNode;
  loading: boolean;
  properties?: {
    isOnline?: boolean;
    cfbToken: ReactElement;
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
  subValue,
  subValue2,
  loading,
  properties,
}) => {
  return (
    <div className="relative flex flex-col gap-1 rounded-xl px-4 md:px-8 py-4 md:py-6 border-1 border-primary-60 bg-primary-70">
      {properties?.cfbToken}
      <div className="flex items-center gap-2">
        <span className="font-space text-sm text-gray-50">{label}</span>
        {index === 0 && <AnimationPing isOnline={properties?.isOnline} />}
      </div>

      {loading ? (
        <div
          className={`animate-pulse ${index === 0 ? "w-1/3" : "sm:w-1/2 w-2/3"} my-1 h-4 rounded-xl bg-gray-800`}
        />
      ) : (
        <div className="flex flex-col">
          <div className="flex items-center">
            <p className={`whitespace-nowrap font-space text-lg md:text-2xl`}>
              {loading ? "" : value}
            </p>
            {subValue2 && (
              <div className="ml-2 font-space text-sm text-gray-50">
                {loading ? "" : subValue2}
              </div>
            )}
          </div>
          {subValue && (
            <div className="font-space text-sm text-gray-50">
              {loading ? "" : subValue}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default memo<CardProps>(Card);
