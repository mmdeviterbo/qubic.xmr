import { type FC, memo, useLayoutEffect, useMemo, useState } from "react";

import isNull from "lodash/isNull";
import isEmpty from "lodash/isEmpty";
import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";

import type { MiningStats } from "@/types/MiningStats";
import ChartSkeleton from "../common/ChartSkeleton";
import { Labels } from "@/utils/constants";
import FilterButtons from "../common/FilterButtons";

interface DistributionChartProps {
  id: string;
  block_distributions: MiningStats["monero_block_distributions"];
  loading: boolean;
}

enum LAST_N_DISTRIBUTION {
  THOUSAND = "1000",
  HUNDRED = "100",
}

const DistributionChart: FC<DistributionChartProps> = ({
  id,
  block_distributions,
  loading,
}) => {
  const [distributionType, setDistributionType] = useState<LAST_N_DISTRIBUTION>(
    LAST_N_DISTRIBUTION.THOUSAND,
  );

  const isThousanDistributionType = useMemo(
    () => distributionType === LAST_N_DISTRIBUTION.THOUSAND,
    [distributionType],
  );

  const countByDistributionType = useMemo(() => {
    if (isEmpty(block_distributions)) {
      return null;
    }
    return isThousanDistributionType
      ? (block_distributions.last1000Blocks / 1000) * 100
      : block_distributions.last100Blocks;
  }, [isThousanDistributionType, block_distributions]);

  useLayoutEffect(() => {
    if (isNull(countByDistributionType)) {
      return;
    }

    const ctx: HTMLCanvasElement = document.querySelector(`canvas#${id}`);
    if (!ctx) {
      return;
    }

    const pieChart = new Chart(ctx, {
      plugins: [ChartDataLabels],
      type: "doughnut",
      data: {
        labels: ["qubic.org", "others"],
        datasets: [
          {
            label: "Block distribution",
            data: [countByDistributionType, 100 - countByDistributionType],
            backgroundColor: ["rgb(54, 162, 235)", "rgb(39,96,137)"],
            borderWidth: 0,
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
              label: (tooltipItem) => {
                const label = Labels.BLOCKS_FOUND;
                const value = isThousanDistributionType
                  ? Number(tooltipItem.formattedValue) * 10
                  : tooltipItem.formattedValue;
                return ` ${label.concat(`: ${Number(value).toLocaleString()}`)}`;
              },
            },
          },
          datalabels: {
            color: "white",
            formatter: (value: number) => String(value.toFixed(1)).concat("%"),
          },
        },
      },
    });

    return () => {
      pieChart.destroy();
    };
  }, [id, isThousanDistributionType, countByDistributionType]);

  return (
    <div className="w-full relative">
      {loading ? (
        <ChartSkeleton />
      ) : (
        <div className="flex flex-col">
          <FilterButtons
            leftButtons={[
              {
                label: `Last ${Number(LAST_N_DISTRIBUTION.THOUSAND).toLocaleString()}`,
                onClick: () =>
                  setDistributionType(LAST_N_DISTRIBUTION.THOUSAND),
                isActive: LAST_N_DISTRIBUTION.THOUSAND === distributionType,
              },
              {
                label: `Last ${Number(LAST_N_DISTRIBUTION.HUNDRED).toLocaleString()}`,
                onClick: () => setDistributionType(LAST_N_DISTRIBUTION.HUNDRED),
                isActive: LAST_N_DISTRIBUTION.HUNDRED === distributionType,
              },
            ]}
          />

          <div className="relative grid place-items-center md:h-[25rem]">
            <canvas id={id} />
          </div>
        </div>
      )}
    </div>
  );
};

export default memo<DistributionChartProps>(DistributionChart);
