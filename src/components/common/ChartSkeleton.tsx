import { type FC } from "react";

const ChartSkeleton: FC = () => {
  return (
    <div className="mt-4">
      <div
        className={`animate-pulse w-full h-4 sm:h-6 rounded-xl bg-gray-800 mb-3`}
      />
      <div
        className={`animate-pulse w-full h-4 sm:h-6 rounded-xl bg-gray-800 mb-3`}
      />
      <div
        className={`animate-pulse w-full h-4 sm:h-6 rounded-xl bg-gray-800 mb-3`}
      />
    </div>
  );
};

export default ChartSkeleton;
