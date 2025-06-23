import {
  type FC,
  memo,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";

import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import dayjs from "dayjs";
import isEmpty from "lodash/isEmpty";

import type { XMRHistoryCharts } from "@/types/MiningStats";
import ChartSkeleton from "../common/ChartSkeleton";
import { formatLargeNumber } from "@/utils/numbers";
import { moneroTicker, tariTicker } from "@/utils/constants";
import FilterButtons from "../common/FilterButtons";
import useBreakpoints from "@/hooks/useBreakpoints";

interface BlockChartProps {
  id: string;
  blocks_found_chart: XMRHistoryCharts["blocks_found_chart"];
  loading: boolean;
}

enum Timeframe {
  EPOCH,
  DAILY,
}

const BlockChart: FC<BlockChartProps> = ({
  id,
  blocks_found_chart,
  loading,
}) => {
  const { isMd, isLg } = useBreakpoints();

  const isWiderScreen = useMemo(() => isMd || isLg, [isMd, isLg]);

  const ticker = useMemo(
    () => (id?.includes("monero") ? moneroTicker : tariTicker),
    [id],
  );

  const [timeframe, setTimeframe] = useState<Timeframe>(Timeframe.EPOCH);

  const [xy, setXY] = useState<{ x: string[]; y: number[] }>();

  const getTotalReward = useCallback(
    (index: number, timeframe: Timeframe): string => {
      let totalReward = "0";
      if (timeframe === Timeframe.DAILY) {
        totalReward =
          blocks_found_chart?.daily?.at(index)?.reward?.toString() ?? "";
      } else {
        totalReward =
          blocks_found_chart?.weekly?.at(index)?.reward?.toString() ?? "";
      }
      totalReward = `${formatLargeNumber(Number(totalReward))} ${ticker}`;
      return totalReward;
    },
    [blocks_found_chart, ticker],
  );

  const getTotalUSDT = useCallback(
    (index: number, timeframe: Timeframe): string => {
      let formattedTotalUSDT = "";
      if (timeframe === Timeframe.EPOCH) {
        const total_usdt = blocks_found_chart?.weekly?.at(index)?.total_usdt;
        if (!total_usdt) {
          return formattedTotalUSDT;
        }
        formattedTotalUSDT = `$${formatLargeNumber(Number(total_usdt))}`;
      }
      return formattedTotalUSDT;
    },
    [blocks_found_chart],
  );

  useEffect(() => {
    if (isEmpty(blocks_found_chart)) {
      return;
    }
    const { daily, weekly } = blocks_found_chart;

    const isDailyTimeFrame = timeframe === Timeframe.DAILY;
    const x = (isDailyTimeFrame ? daily : weekly).map((i) =>
      isDailyTimeFrame ? dayjs(i.timestamp).format("MMM D") : String(i.epoch),
    );
    const y = (isDailyTimeFrame ? daily : weekly).map((i) => i.blocks_found);
    setXY({ x, y });
  }, [timeframe, blocks_found_chart]);

  useLayoutEffect(() => {
    if (isEmpty(xy)) {
      return;
    }

    const ctx: HTMLCanvasElement = document.querySelector(`canvas#${id}`);
    if (!ctx) {
      return;
    }

    const barChart = new Chart(ctx, {
      plugins: [ChartDataLabels],
      type: "bar",
      data: {
        labels: xy.x,
        datasets: [
          {
            label: "Blocks found",
            data: xy.y,
            borderWidth: 1,
            borderRadius: timeframe === Timeframe.DAILY ? 1 : 2,
            datalabels: {
              font: {
                size: isWiderScreen
                  ? timeframe === Timeframe.EPOCH
                    ? 12
                    : 10
                  : timeframe === Timeframe.EPOCH
                    ? 8
                    : 7,
              },
            },
          },
        ],
      },
      options: {
        animation: false,
        responsive: true,
        plugins: {
          tooltip: {
            callbacks: {
              title: (tooltipItems) => {
                const label =
                  timeframe === Timeframe.EPOCH
                    ? "Epoch ".concat(tooltipItems[0].label)
                    : tooltipItems[0].label;
                return label;
              },
              label: (tooltipItem) => {
                const label = tooltipItem.dataset.label;
                const index = tooltipItem.dataIndex;
                const value = tooltipItem.formattedValue;

                const totalReward = getTotalReward(index, timeframe);
                const totalUSDT = getTotalUSDT(index, timeframe);
                const lines = [
                  ` ${label.concat(`: ${value}`)}`,
                  ` ≈ ${totalReward}`,
                ];
                if (totalUSDT) {
                  lines.push(` ≈ ${totalUSDT}`);
                }
                return lines;
              },
            },
          },
          datalabels: {
            color: "white",
            formatter: (value, context) => {
              const index = context.dataIndex;
              const totalUSDT = getTotalUSDT(index, timeframe);
              const lines = [value];
              if (totalUSDT) {
                // if (index !== 0) {
                //   lines.push(``);
                // }
                lines.push(totalUSDT);
              }
              return lines;
            },
            textAlign: "center",
            anchor: timeframe === Timeframe.DAILY ? "end" : "center",
            align: timeframe === Timeframe.DAILY ? "top" : "center",
            offset: timeframe === Timeframe.DAILY ? 1 : 0,
          },
          legend: {
            display: false,
          },
        },
      },
    });
    return () => {
      barChart.destroy();
    };
  }, [xy, id]);

  return (
    <div className="w-full relative">
      {loading ? (
        <ChartSkeleton />
      ) : (
        <div className="relative flex flex-col">
          <FilterButtons
            buttons={[
              {
                label: "Epoch",
                onClick: () => setTimeframe(Timeframe.EPOCH),
                isActive: Timeframe.EPOCH === timeframe,
              },
              {
                label: "1d",
                onClick: () => setTimeframe(Timeframe.DAILY),
                isActive: Timeframe.DAILY === timeframe,
              },
            ]}
          />
          <div className="z-1 pl-12 md:pl-16 flex items-end gap-1 opacity-[0.06] h-[45%] absolute text-xs md:text-sm">
            Powered by
            <span className="cfb-token-text font-normal">$CFB</span>
          </div>
          <canvas id={id} />
        </div>
      )}
    </div>
  );
};

export default memo<BlockChartProps>(BlockChart);
