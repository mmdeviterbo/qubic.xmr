import { FC, memo, useEffect, useLayoutEffect, useState } from "react";

import isEmpty from "lodash/isEmpty";
import Chart from "chart.js/auto";

import ChartSkeleton from "../common/ChartSkeleton";
import type { HistoryCharts } from "@/types/MiningStats";
import { formatLargeInteger } from "@/utils/numbers";

interface MaxHashratesChartProps {
  id: string;
  max_hashrates_chart: HistoryCharts["max_hashrates_chart"];
  loading: boolean;
}

const MaxHashratesChart: FC<MaxHashratesChartProps> = ({
  id,
  max_hashrates_chart,
  loading,
}) => {
  const [chart, setChart] = useState<Chart>();

  const [xy, setXY] = useState<{ x: string[]; y: number[] }>();

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
    const lineChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: xy.x,
        datasets: [
          {
            label: `Peak Hashrates`,
            data: xy.y,
            borderWidth: 1,
          },
        ],
      },
      options: {
        plugins: {
          legend: {
            labels: {
              usePointStyle: true,
              pointStyle: "circle",
              font: {
                size: 10,
              },
            },
          },
        },
        responsive: true,
        scales: {
          y: {
            ticks: {
              callback: function (value, index, ticks) {
                return formatLargeInteger(Number(value), 0);
              },
            },
            beginAtZero: true,
          },
        },
      },
    });
    setChart(chart);
    return () => {
      lineChart.destroy();
    };
  }, [xy]);

  return (
    <div className="w-full relative">
      {loading ? <ChartSkeleton /> : <canvas id={id} />}
    </div>
  );
};

export default memo<MaxHashratesChartProps>(MaxHashratesChart);
