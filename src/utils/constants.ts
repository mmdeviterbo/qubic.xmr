export const QUBIC_XMR_STATS_URL = "https://xmr-stats.qubic.org/stats";
export const EXPLORER_QUBIC_URL = "https://explorer.qubic.org/network";

export const MONERO_MINING_POOLS_STATS_URL = (milliseconds: number) =>
  `https://data.miningpoolstats.stream/data/monero.js?t=${milliseconds}`;

export const moneroTicker = "XMR";
export const blockToXMRConversion = 0.6; //approximate

export const enum Labels {
  HASHRATE = "Hashrate",
  AVG_1H_HASHRATE = "Avg 1H Hashrate",
  AVG_7D_HASHRATE = "Avg 7D Hashrate",
  BLOCKS_FOUND = "Blocks Found",
  LAST_BLOCK_FOUND = "Last Block Found",
  CONNECTED_MINERS = "Connected Miners",
  MONERO_NETWORK_HASHRATE = "Monero Network Hashrate",
  MONERO_NETWORK_DIFFICULTY = "Monero Network Difficulty",
}
