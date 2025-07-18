import { memo, type FC, type ReactNode } from "react";

import isEmpty from "lodash/isEmpty";

type Subtitle = {
  label: string;
  sublabel?: string;
  value: string | number;
  properties?: {
    animate?: boolean;
  };
};

interface ChartContainerProps {
  title: ReactNode;
  leftSubtitle: Subtitle;
  rightSubtitles: Subtitle[];
  chart: ReactNode;
  loading: boolean;
}

const ChartContainer: FC<ChartContainerProps> = ({
  title,
  leftSubtitle,
  rightSubtitles,
  chart,
  loading,
}) => {
  return (
    <div
      className={`relative flex flex-col gap-1 rounded-xl px-4 md:px-8 py-4 md:py-6 border-1 border-primary-60 bg-primary-70`}
    >
      <p className="font-space text-sm text-gray-50 mb-1 md:mb-2">{title}</p>

      <div className="flex justify-between items-end w-full">
        {!loading && (
          <div>
            <div className="flex items-center gap-1">
              <span className={`text-lg md:text-2xl`}>
                {leftSubtitle.value}
              </span>
              <span className="ml-1 font-space text-sm text-gray-50">
                {leftSubtitle?.sublabel}
              </span>
            </div>

            <p className="text-gray-50 text-xs">{leftSubtitle?.label ?? ""}</p>
          </div>
        )}

        <div className="w-fit gap-0 text-xs md:text-sm">
          {rightSubtitles.map((r) => (
            <div
              key={r.label}
              className={`flex gap-3 justify-between ${loading ? "items-center mb-1 gap-1" : "gap-3 "}`}
            >
              {!loading && !isEmpty(r.value) && (
                <span className="text-gray-50 whitespace-nowrap">
                  {r.label}
                </span>
              )}

              {!loading ? (
                <span className="whitespace-nowrap">{r.value}</span>
              ) : (
                <div className="animate-pulse w-10 h-2 rounded-xl bg-gray-800" />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="my-2 mt-4">{chart}</div>
    </div>
  );
};

export default memo<ChartContainerProps>(ChartContainer);
