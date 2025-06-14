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
                size: timeframe === Timeframe.DAILY ? 10 : 12,
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
                const label = "Epoch ".concat(tooltipItems[0].label);
                return label;
              },
              label: (tooltipItem) => {
                const label = tooltipItem.dataset.label;
                const index = tooltipItem.dataIndex;
                const value = tooltipItem.formattedValue.concat(
                  ` ≈ ${getTotalReward(index, timeframe)}`,
                );
                return ` ${label.concat(`: ${value}`)}`;
              },
            },
          },
          datalabels: {
            color: "white",
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
        <div className="flex flex-col">
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
          <canvas id={id} />
        </div>
      )}
    </div>
  );
};

export default memo<BlockChartProps>(BlockChart);
