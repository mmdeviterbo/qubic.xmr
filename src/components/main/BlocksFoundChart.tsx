import {
  type FC,
  memo,
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";

import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import dayjs from "dayjs";
import isEmpty from "lodash/isEmpty";

import type { XMRHistoryCharts } from "@/types/MiningStats";
import ChartSkeleton from "../common/ChartSkeleton";

interface BarChartProps {
  id: string;
  blocks_found_chart: XMRHistoryCharts["blocks_found_chart"];
  loading: boolean;
}

enum Timeframe {
  DAILY,
  WEEKLY,
}

const BarChart: FC<BarChartProps> = ({ id, blocks_found_chart, loading }) => {
  const [chart, setChart] = useState<Chart>();

  const [timeframe, setTimeframe] = useState<Timeframe>(Timeframe.WEEKLY);

  const [xy, setXY] = useState<{ x: string[]; y: number[] }>();

  const handleResize = useCallback(() => chart?.resize(), [chart]);

  useEffect(() => {
    if (isEmpty(blocks_found_chart)) {
      return;
    }
    const { daily, weekly } = blocks_found_chart;

    // const sumD = daily.reduce((partialSum, a) => partialSum + Number(a.blocks_found), 0);
    // console.log(sumD); // 6

    // const sumW = weekly.reduce((partialSum, a) => partialSum + Number(a.blocks_found), 0);
    // console.log(sumW); // 6

    const isDailyTimeFrame = timeframe === Timeframe.DAILY;
    const x = (isDailyTimeFrame ? daily : weekly).map((i) =>
      isDailyTimeFrame
        ? dayjs(i.timestamp).format("MMM D")
        : "Epoch ".concat(i.epoch),
    );
    const y = (isDailyTimeFrame ? daily : weekly).map((i) => i.blocks_found);
    setXY({ x, y });
  }, [timeframe, blocks_found_chart]);

  useLayoutEffect(() => {
    if (isEmpty(xy)) {
      return;
    }

    const ctx: HTMLCanvasElement = document.querySelector(`canvas#${id}`);
    if(!ctx) {
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
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          datalabels: {
            color: "white",
          },
          legend: {
            display: false,
          },
        },
      },
    });
    setChart(barChart);
    return () => {
      barChart.destroy();
    };
  }, [xy, id]);

  useLayoutEffect(() => {
    if (isEmpty(chart)) {
      return;
    }
    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, [chart]);

  return (
    <div className="w-full relative z-100">
      {loading ? (
        <ChartSkeleton />
      ) : (
        <div className="flex flex-col">
          <div className="mb-4 flex gap-2">
            <button
              onClick={() => setTimeframe(Timeframe.WEEKLY)}
              className={`z-100 cursor-pointer inline-flex items-center rounded-md px-2 py-1 text-xs ${timeframe === Timeframe.WEEKLY ? "ring-1 ring-gray-500/10 ring-inset bg-gray-800 text-gray-400" : "text-gray-600"}`}
            >
              Epoch
            </button>
            <button
              onClick={() => setTimeframe(Timeframe.DAILY)}
              className={`z-100 cursor-pointer inline-flex items-center rounded-md px-2 py-1 text-xs ${timeframe === Timeframe.DAILY ? "ring-1 ring-gray-500/10 ring-inset bg-gray-800 text-gray-400" : "text-gray-600"}`}
            >
              1d
            </button>
          </div>
          <canvas id={id} />
        </div>
      )}
    </div>
  );
};

export default memo<BarChartProps>(BarChart);
