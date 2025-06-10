import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import {
  TARI_BLOCK_API_URL,
  TARI_BLOCKS_FULL_HISTORY_API_URL,
} from "@/utils/constants";
import { XTMHistoryCharts, XTMMiningHistory } from "@/types/MiningStats";
import XTM_HISTORY from "@/utils/history/xtm-history.json";
import { calculateTotalXTM, getXtmChartHistory } from "@/utils/xtm-charts";

const filterBlocksByCheckpoints = (blocks: number[]): number[] => {
  return blocks.filter(
    (b) => !XTM_HISTORY.find((s) => Number(s.block) === Number(b)),
  );
};

const getQubicBlocksHistory = async (
  blocks: number[],
): Promise<XTMMiningHistory[]> => {
  const promises = [];
  blocks.forEach((block) =>
    promises.push(axios.get(TARI_BLOCK_API_URL(block))),
  );

  if (!blocks.length) {
    return XTM_HISTORY;
  }

  const tariblocksWithDetails = await Promise.all(promises);

  const fetchedXtmHistory = tariblocksWithDetails.map(({ data }) => ({
    block: data.height as number,
    timestamp: new Date(Number(data.header.timestamp) * 1000).toISOString(),
    reward: parseFloat((data.totalCoinbaseXtm as string).replace(",", "")),
  })) as XTMMiningHistory[];

  const newXtmHistory: XTMMiningHistory[] = XTM_HISTORY;
  newXtmHistory.push(...fetchedXtmHistory);
  return newXtmHistory;
};

const getResponseToQubicBlocks = async (): Promise<number[]> => {
  const fullHistory = await axios.get(TARI_BLOCKS_FULL_HISTORY_API_URL, {
    responseType: "text",
  });

  const responseString = fullHistory.data as string;
  const firstIndexByQubicName = responseString.indexOf("RXM_QUBIC.ORG");

  const firstStringIndex = responseString
    .slice(firstIndexByQubicName)
    .indexOf("[");
  const lastStringIndex = responseString
    .slice(firstIndexByQubicName)
    .indexOf("]");

  const blocksString = responseString.slice(
    firstIndexByQubicName + firstStringIndex + 1,
    firstIndexByQubicName + lastStringIndex,
  );

  const blocks = blocksString.split(" ").map((b) => Number(b));
  return blocks;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<XTMHistoryCharts>,
) {
  try {
    let blocks = await getResponseToQubicBlocks();

    blocks = filterBlocksByCheckpoints(blocks);

    let xtmHistory = await getQubicBlocksHistory(blocks);

    const { blocks_found_chart } = getXtmChartHistory(xtmHistory);

    const pool_blocks_found = xtmHistory.length;
    const last_block_found = xtmHistory.at(-1).timestamp;
    const total_xtm = calculateTotalXTM(xtmHistory);

    res.setHeader("Cache-Control", "public, max-age=300");
    res.setHeader("CDN-Cache-Control", "public, max-age=420");
    res.setHeader("Vercel-CDN-Cache-Control", "public, max-age=540");

    res.status(200).json({
      total_xtm,
      pool_blocks_found,
      last_block_found,
      blocks_found_chart,
    });
  } catch (error) {
    console.log("error:", error);
    res.status(400);
  }
}
