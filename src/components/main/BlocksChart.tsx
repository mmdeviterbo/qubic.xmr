import {
  type FC,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import dayjs from "dayjs";
import isEmpty from "lodash/isEmpty";

import { type AdvanceMiningCharts } from "@/types/MiningStats";
import ChartSkeleton from "../common/ChartSkeleton";
import FilterButtons from "../common/FilterButtons";
import { formatLargeNumber } from "@/utils/numbers";
import { moneroTicker, tariTicker } from "@/utils/constants";
import useBreakpoints from "@/hooks/useBreakpoints";

interface BlockChartProps {
  id: string;
  blocks_found_chart: AdvanceMiningCharts["blocksChart"];
  loading: boolean;
}

enum Timeframe {
  EPOCH,
  DAILY,
}

enum ChartType {
  BAR = "bar",
  LINE = "line",
}

const BlockChart: FC<BlockChartProps> = ({
  id,
  blocks_found_chart,
  loading,
}) => {
  const { isMd, isLg, isSm } = useBreakpoints();

  const isWiderScreen = useMemo(() => isMd || isLg, [isMd, isLg]);

  const ticker = useMemo(
    () => (id?.includes("monero") ? moneroTicker : tariTicker),
    [id],
  );

  const highestTenAndLatestDailyBlocksFound = useMemo(() => {
    const blocks = blocks_found_chart?.daily
      ?.map((b) => Number(b.blocks_found))
      ?.sort((a, b) => b - a);
    const tenHighestBlocks = blocks?.slice(0, 10);
    return tenHighestBlocks;
  }, [blocks_found_chart]);

  const [chartType, setChartType] = useState<ChartType>(ChartType.BAR);
  const [timeframe, setTimeframe] = useState<Timeframe>(Timeframe.EPOCH);

  const [xy, setXY] = useState<{ x: string[]; y: number[] }>();

  const isBarChart = useMemo(() => chartType === ChartType.BAR, [chartType]);

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
    (index: number, timeframe: Timeframe, scale: number): string => {
      let formattedTotalUSDT = "";
      if (timeframe === Timeframe.EPOCH) {
        const total_usdt = blocks_found_chart?.weekly?.at(index)?.total_usdt;
        if (!total_usdt) {
          return formattedTotalUSDT;
        }
        formattedTotalUSDT = `$${formatLargeNumber(Number(total_usdt), scale)}`;
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

  useEffect(() => {
    if (isEmpty(xy)) {
      return;
    }

    const ctx: HTMLCanvasElement = document.querySelector(`canvas#${id}`);
    if (!ctx) {
      return;
    }

    const chart = new Chart(ctx, {
      plugins: [ChartDataLabels],
      type: chartType,
      data: {
        labels: xy.x,
        datasets: [
          {
            label: "Blocks found",
            data: xy.y,
            borderWidth: 1,
            borderRadius: timeframe === Timeframe.DAILY ? 1 : 2,
            pointRadius: 0,
            clip: false,
            datalabels: {
              font: {
                size: isWiderScreen
                  ? timeframe === Timeframe.EPOCH
                    ? 10
                    : 8
                  : timeframe === Timeframe.EPOCH
                    ? 6.5
                    : 6,
              },
            },
          },
        ],
      },
      options: {
        animation: false,
        responsive: true,
        layout: {
          padding: {
            top: timeframe === Timeframe.DAILY ? 15 : 0,
            right: 2,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
          },
        },
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
                const totalUSDT = getTotalUSDT(index, timeframe, 2);
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
              if (isBarChart) {
                const index = context.dataIndex,
                  total = context.dataset.data.length;
                const totalUSDT = getTotalUSDT(index, timeframe, 1);
                const lines = [value];
                if (totalUSDT) {
                  // if (index !== 0) {
                  //   lines.push(``);
                  // }
                  lines.push(totalUSDT);
                }
                return (isSm || isMd) && timeframe === Timeframe.DAILY
                  ? highestTenAndLatestDailyBlocksFound?.includes(value) ||
                    index === total - 1
                    ? lines
                    : ""
                  : lines;
              }
              return "";
            },
            offset: -2,
            textAlign: "center",
            anchor: timeframe === Timeframe.DAILY ? "end" : "center",
            align: timeframe === Timeframe.DAILY ? "top" : "center",
          },
          legend: {
            display: false,
          },
        },
      },
    });

    return () => {
      chart.destroy();
    };
  }, [xy, id, chartType, isSm, isMd, timeframe]);

  return (
    <div className="w-full relative">
      {loading ? (
        <ChartSkeleton />
      ) : (
        <div className="relative flex flex-col">
          <FilterButtons
            leftButtons={[
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
            rightButtons={[
              {
                label: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 3v16a2 2 0 0 0 2 2h16" />
                    <path d="M18 17V9" />
                    <path d="M13 17V5" />
                    <path d="M8 17v-3" />
                  </svg>
                ),
                onClick: () => setChartType(ChartType.BAR),
                isActive: isBarChart,
              },
              {
                label: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 3v16a2 2 0 0 0 2 2h16" />
                    <path d="m19 9-5 5-4-4-3 3" />
                  </svg>
                ),
                onClick: () => setChartType(ChartType.LINE),
                isActive: !isBarChart,
              },
            ]}
          />
          {!loading && (
            <div className="z-1 pl-12 md:pl-16 flex items-end gap-1 opacity-[0.065] h-[45%] absolute text-base md:text-xl">
              Powered by
              <span className="cfb-token-text-normal">$CFB</span>
            </div>
          )}
          <canvas id={id} />
        </div>
      )}
    </div>
  );
};

export default memo<BlockChartProps>(BlockChart);
