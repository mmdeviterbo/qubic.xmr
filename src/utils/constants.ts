export const QUBIC_XMR_STATS_URL = "https://xmr-stats.qubic.org/stats";
export const EXPLORER_QUBIC_URL = "https://explorer.qubic.org/network";
export const MONERO_MINING_POOLS_STATS_BASE_URL = "miningpoolstats.stream";

export const MONERO_MINING_BLOCK_FOUND_URL = (seconds?: number) =>
  `https://${MONERO_MINING_POOLS_STATS_BASE_URL}/data/time?t=${seconds}`;

export const MONERO_MINING_POOLS_STATS_URL = (seconds: number) =>
  `https://data.${MONERO_MINING_POOLS_STATS_BASE_URL}/data/monero.js?t=${seconds}`;

export const MONERO_MINING_POOLS_BLOCKS_URL = (seconds: number) =>
  `https://data.${MONERO_MINING_POOLS_STATS_BASE_URL}/data/blocks/monero.js?t=${seconds}`;

export const MONERO_BLOCK_INFO = (block: number) => `https://moneroexplorer.org/api/search/${block}`;


export const QUBIC_XMR_FULL_HISTORY_ON_RENDER_URL =
  "https://qubicxmr.onrender.com/_dash-update-component";

export const moneroTicker = "XMR";
export const blockToXMRConversion = 0.6; //approximate

export const enum Labels {
  HASHRATE = "Hashrate",
  PEAK_HASHRATE = "Peak Hashrate",
  AVG_1H_HASHRATE = "Avg 1H Hashrate",
  AVG_7D_HASHRATE = "Avg 7D Hashrate",
  BLOCKS_FOUND = "Blocks Found",
  TOTAL_BLOCKS_FOUND = "Total Blocks Found",
  DAILY_BLOCKS_FOUND = "Daily Blocks Found",
  EPOCH_BLOCKS_FOUND = "Epoch <number> Blocks Found ",
  LAST_BLOCK_FOUND = "Last Block Found",
  CONNECTED_MINERS = "Connected Miners",
  MONERO_NETWORK_HASHRATE = "Monero Network Hashrate",
  MONERO_NETWORK_DIFFICULTY = "Monero Network Difficulty",
}
