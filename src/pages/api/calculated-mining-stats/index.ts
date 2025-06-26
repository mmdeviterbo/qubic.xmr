import type { NextApiRequest, NextApiResponse } from "next";

import type { CalculatedXMRMiningStats } from "@/types/MiningStats";

import getMoneroCalculatedMiningStats from "@/apis/calculated-xmr-stats";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CalculatedXMRMiningStats>,
) {
  try {
    const response = await getMoneroCalculatedMiningStats();

    res.setHeader("Cache-Control", "public, max-age=20, s-maxage=40");
    res.setHeader("CDN-Cache-Control", "public, s-maxage=60");
    res.setHeader("Vercel-CDN-Cache-Control", "public, s-maxage=120");

    res.status(200).json(response);
  } catch (e) {
    res.status(401);
  }
}
