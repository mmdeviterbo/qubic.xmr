export const QUBIC_XMR_STATS_URL = "https://xmr-stats.qubic.org/stats";
export const EXPLORER_QUBIC_URL = "https://explorer.qubic.org/network";
export const MONERO_MINING_POOLS_STATS_BASE_URL = "miningpoolstats.stream";

export const MONERO_MINING_LATEST_BLOCK_FOUND_URL = (seconds?: number) =>
  `https://${MONERO_MINING_POOLS_STATS_BASE_URL}/data/time?t=${seconds}`;

export const MONERO_MINING_POOLS_STATS_URL = (seconds: number) =>
  `https://data.${MONERO_MINING_POOLS_STATS_BASE_URL}/data/monero.js?t=${seconds}`;

export const QUBIC_SOLO_MINING_HISTORY =
  "http://66.179.92.83/data/qpool_V1.csv";

export const moneroTicker = "XMR";
export const blockToXMRConversion = 0.6; //approximate

export const cfbTokenStorageId = "cfb-image"

export const enum Labels {
  HASHRATE = "Hashrate",
  PEAK_HASHRATE = "Peak Hashrate",
  AVG_1H_HASHRATE = "Avg 1H Hashrate",
  AVG_7D_HASHRATE = "Avg 7D Hashrate",
  BLOCKS_FOUND = "Blocks Found",
  TOTAL_BLOCKS_FOUND = "Total Blocks Found",
  DAILY_BLOCKS_FOUND = "Daily Blocks Found",
  DAILY_BLOCKS_FOUND_SHORT = "Daily",
  EPOCH_BLOCKS_FOUND = "Epoch <number> Blocks Found ",
  EPOCH_BLOCKS_FOUND_SHORT = "Epoch <number> ",
  LAST_BLOCK_FOUND = "Last Block Found",
  CONNECTED_MINERS = "Connected Miners",
  MONERO_NETWORK_HASHRATE = "Monero Network Hashrate",
  MONERO_NETWORK_DIFFICULTY = "Monero Network Difficulty",
}
