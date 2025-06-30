import { type FC, memo, useEffect, useLayoutEffect, useState } from "react";

import isEmpty from "lodash/isEmpty";
import Chart from "chart.js/auto";

import ChartSkeleton from "../common/ChartSkeleton";
import { MaxHashratesWeeklyChart } from "@/types/MiningStats";
import { formatHashrate } from "@/utils/numbers";
import { Labels } from "@/utils/constants";
import useBreakpoints from "@/hooks/useBreakpoints";

interface MaxHashratesChartProps {
  id: string;
  max_hashrates_chart: MaxHashratesWeeklyChart[];
  loading: boolean;
}

const MaxHashratesChart: FC<MaxHashratesChartProps> = ({
  id,
  max_hashrates_chart,
  loading,
}) => {
  const { isSm } = useBreakpoints();

  const [xy, setXY] = useState<{ x: string[]; y: number[] }>();

  useEffect(() => {
    if (isEmpty(max_hashrates_chart)) {
      return;
    }
    const x = max_hashrates_chart.map((i) => String(i.epoch));
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
            label: Labels.PEAK_HASHRATE.concat(" per Epoch"),
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
        maintainAspectRatio: false,
        plugins: {
          tooltip: {
            callbacks: {
              title: (tooltipItems) => {
                const label = "Epoch ".concat(tooltipItems[0].label);
                return label;
              },
              label: (ctx) => {
                let label =
                  ctx.dataset.label.replace("per Epoch", "").concat(": ") || "";
                let value = ctx.parsed.y;

                if (!isNaN(value)) {
                  return ` ${label.concat(formatHashrate(Number(value)))}`;
                }
                return ` ${label.concat(`: ${value.toString()}`)}`;
              },
            },
          },
          legend: {
            labels: {
              usePointStyle: true,
              font: {
                size: 11.5,
              },
            },
          },
        },
        scales: {
          y: {
            ticks: {
              callback: function (value) {
                return formatHashrate(Number(value), 0);
              },
            },
            beginAtZero: true,
          },
        },
      },
    });
    return () => {
      lineChart.destroy();
    };
  }, [id, xy]);

  return (
    <div
      className="w-full relative"
      style={{ minHeight: loading ? "fit-content" : isSm ? "40vh" : "50dvh" }}
    >
      {!loading && (
        <div className="z-1 pl-12 md:pl-16 ml-8 md:ml-10 flex items-end gap-1 opacity-[0.065] h-[45%] absolute text-base md:text-xl">
          Powered by
          <span className="cfb-token-text-normal">$CFB</span>
        </div>
      )}

      {loading ? <ChartSkeleton /> : <canvas id={id} />}
    </div>
  );
};

export default memo<MaxHashratesChartProps>(MaxHashratesChart);
