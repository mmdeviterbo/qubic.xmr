import {
  FC,
  memo,
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";

import isEmpty from "lodash/isEmpty";
import Chart from "chart.js/auto";

import ChartSkeleton from "../common/ChartSkeleton";
import type { XMRHistoryCharts } from "@/types/MiningStats";
import { formatLargeInteger } from "@/utils/numbers";
import { Labels } from "@/utils/constants";

interface MaxHashratesChartProps {
  id: string;
  max_hashrates_chart: XMRHistoryCharts["max_hashrates_chart"];
  loading: boolean;
}

const MaxHashratesChart: FC<MaxHashratesChartProps> = ({
  id,
  max_hashrates_chart,
  loading,
}) => {
  const [chart, setChart] = useState<Chart>();

  const [xy, setXY] = useState<{ x: string[]; y: number[] }>();

  const handleResize = useCallback(() => chart?.resize(), [chart]);

  useEffect(() => {
    if (isEmpty(max_hashrates_chart)) {
      return;
    }
    const x = max_hashrates_chart.map((i) => `Epoch ${i.epoch}`);
    const y = max_hashrates_chart.map((i) => Number(i.max_hashrate));
    setXY({ x, y });
  }, [max_hashrates_chart]);

  useLayoutEffect(() => {
    if (isEmpty(xy)) {
      return;
    }

    const ctx: HTMLCanvasElement = document.querySelector(`canvas#${id}`);
    if (!ctx) {
      return;
    }

    const lineChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: xy.x,
        datasets: [
          {
            label: Labels.PEAK_HASHRATE,
            data: xy.y,
            borderWidth: 1,
            pointRadius: 5,
            pointHoverRadius: 8,
            pointStyle: "circle",
          },
        ],
      },
      options: {
        animation: false,
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 1.8,
        plugins: {
          legend: {
            labels: {
              usePointStyle: true,
              font: {
                size: 12,
              },
            },
          },
        },
        scales: {
          y: {
            ticks: {
              callback: function (value) {
                return formatLargeInteger(Number(value), 0);
              },
            },
            beginAtZero: true,
          },
        },
      },
    });
    setChart(lineChart);
    return () => {
      lineChart.destroy();
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
      {loading ? <ChartSkeleton /> : <canvas id={id} />}
    </div>
  );
};

export default memo<MaxHashratesChartProps>(MaxHashratesChart);
