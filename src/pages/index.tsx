import { useEffect, useState } from "react";
import type { NextPage } from "next";
import Head from "next/head";

import axios from "axios";
import isEmpty from "lodash/isEmpty";
import useSWR from "swr";

import type { CalculatedMiningStats, MiningStats } from "@/types/MiningStats";
import Main from "@/components/main/Main";
import {
  CALCULATED_MINING_STATS_URL,
  MINING_STATS_URL,
  SWR_HOOK_DEFAULTS,
} from "@/utils/constants";
import Footer from "@/components/footer/Footer";

const MINING_STATS_DELAY = 8000;
const CALCULATED_MINING_STATS_DELAY = 90000;

const MainPage: NextPage<{
  miningStatsProps?: MiningStats;
  calculatedMiningStatsProps?: CalculatedMiningStats;
}> = ({ miningStatsProps, calculatedMiningStatsProps }) => {
  const [enableFetchMiningStats, setEnableFetchMiningStats] = useState(false);
  const [
    enableFetchCalculatedhMiningStats,
    setEnableFetchCalculatedhMiningStats,
  ] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setEnableFetchMiningStats(true);
    }, MINING_STATS_DELAY - 4000);

    setTimeout(() => {
      setEnableFetchCalculatedhMiningStats(true);
    }, CALCULATED_MINING_STATS_DELAY);
  }, []);

  const {
    data: miningStats = miningStatsProps,
    isLoading: isLoadingMiningStats,
  } = useSWR<MiningStats>(
    enableFetchMiningStats ? MINING_STATS_URL : null,
    async () => (await fetch(MINING_STATS_URL)).json(),
    {
      ...SWR_HOOK_DEFAULTS,
      refreshInterval: MINING_STATS_DELAY,
      focusThrottleInterval: MINING_STATS_DELAY,
      dedupingInterval: MINING_STATS_DELAY,
    },
  );

  const {
    data: calculatedMiningStats = calculatedMiningStatsProps,
    isLoading: isLoadingCalculatedMiningStats,
  } = useSWR<CalculatedMiningStats>(
    enableFetchCalculatedhMiningStats ? CALCULATED_MINING_STATS_URL : null,
    async () => (await fetch(CALCULATED_MINING_STATS_URL)).json(),
    {
      ...SWR_HOOK_DEFAULTS,
      refreshInterval: CALCULATED_MINING_STATS_DELAY,
      focusThrottleInterval: CALCULATED_MINING_STATS_DELAY,
      dedupingInterval: CALCULATED_MINING_STATS_DELAY,
    },
  );

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="robots" content="index, follow" />
        <meta
          name="description"
          content={
            "Qubic Custom Mining (PoC) as the first to execute Useful Proof of Work (UPoW). Sponsored by $CFB - a first memecoin on Qubic. UI made by Marty de Viterbo."
          }
        />
        <meta
          name="google-site-verification"
          content="kRyiHx6Z1sxZ0B3fxRZdAeTxI62_Z43GopJIw7Bi3k8"
        />
      </Head>

      <main className="mx-auto mt-1.5 md:mt-8 w-full flex flex-col gap-4 lg:w-2/3 xl:w-[55%] px-3 md:px-12 pt-6 md:pt-4">
        <p className="text-xs opacity-0 absolute">Made by Marty De Viterbo</p>
        <Main
          miningStats={isLoadingMiningStats ? miningStatsProps : miningStats}
          isLoadingMiningStats={isEmpty(miningStatsProps)}
          calculatedMiningStats={
            isLoadingCalculatedMiningStats
              ? calculatedMiningStatsProps
              : calculatedMiningStats
          }
          isLoadingCalculatedMiningStats={isEmpty(calculatedMiningStatsProps)}
        />
      </main>

      <footer className="mx-auto w-full flex flex-col gap-4 lg:w-2/3 xl:w-[55%] px-3 md:px-12 py-4 pb-6">
        <Footer />
      </footer>
    </>
  );
};

export const getStaticProps = async () => {
  try {
    const baseUrl = process.env.BASE_URL;

    const miningStatsResponse = await axios.get<MiningStats>(
      `${baseUrl}/api/mining-stats`,
    );

    const calculatedMiningStatsResponse =
      await axios.get<CalculatedMiningStats>(
        `${baseUrl}/api/calculated-mining-stats`,
      );

    let miningStatsProps: MiningStats;
    if (miningStatsResponse.status === 200) {
      miningStatsProps = miningStatsResponse?.data;
    }

    let calculatedMiningStatsProps: CalculatedMiningStats;
    if (calculatedMiningStatsResponse.status === 200) {
      calculatedMiningStatsProps = calculatedMiningStatsResponse?.data;
    }

    return {
      props: {
        miningStatsProps,
        calculatedMiningStatsProps,
      },
      revalidate: 10,
    };
  } catch (e) {
    console.log("getStaticProps error: ", e);
    return { props: {} };
  }
};

// export const getServerSideProps = async () => {
//   try {
//     const baseUrl = process.env.BASE_URL;

//     const miningStatsResponse = await axios.get<MiningStats>(
//       `${baseUrl}/api/mining-stats`,
//     );

//     const calculatedMiningStatsResponse =
//       await axios.get<CalculatedMiningStats>(
//         `${baseUrl}/api/calculated-mining-stats`,
//       );

//     let miningStatsProps: MiningStats;
//     if (miningStatsResponse.status === 200) {
//       miningStatsProps = miningStatsResponse?.data;
//     }

//     let calculatedMiningStatsProps: CalculatedMiningStats;
//     if (calculatedMiningStatsResponse.status === 200) {
//       calculatedMiningStatsProps = calculatedMiningStatsResponse?.data;
//     }

//     return {
//       props: {
//         miningStatsProps,
//         calculatedMiningStatsProps,
//       },
//     };
//   } catch (e) {
//     return { props: {} };
//   }
// };

export default MainPage;
