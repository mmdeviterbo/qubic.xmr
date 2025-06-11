export const ABOUT_ME_NOTE =
  "Made by Marty De Viterbo habang nagkakape sa SM Dasma wahahaha -- May 18, 2025";
export const DONATE_X_URL =
  "https://x.com/cryptokendefi/status/1926657151927267699";

export const QUBIC_XMR_STATS_URL = "https://xmr-stats.qubic.org";
export const QUBIC_XMR_STATS_API_URL = `${QUBIC_XMR_STATS_URL}/stats`;
export const EXPLORER_QUBIC_URL = "https://explorer.qubic.org/network";
export const MONERO_MINING_POOLS_STATS_BASE_URL = "miningpoolstats.stream";
export const QUBIC_XMR_STREAMLIT_APP_URL =
  "https://qubic-xmr-stats.streamlit.app";

export const MONERO_MINING_LATEST_BLOCK_FOUND_URL = (seconds?: number) =>
  `https://${MONERO_MINING_POOLS_STATS_BASE_URL}/data/time?t=${seconds}`;
export const MONERO_MINING_POOLS_STATS_URL = (seconds: number) =>
  `https://data.${MONERO_MINING_POOLS_STATS_BASE_URL}/data/monero.js?t=${seconds}`;

export const QUBIC_SOLO_MINING_HISTORY =
  "http://66.179.92.83/data/qpool_V1.csv";

export const TARI_BLOCKS_FULL_HISTORY_API_URL =
  "https://core.tari.jagtech.io/winners_full_chain.txt";
export const TARI_BLOCK_API_URL = (block: number) =>
  `https://textexplore.tari.com/blocks/${block}?json`;

export const moneroTicker = "XMR";
export const blockToXMRConversion = 0.6;

export const cfbTokenStorageId = "cfb-image";
export const getConfettiStorageId = (pool_block_found: number) =>
  `confetti-blocks-found-${pool_block_found}`;

export const enum Labels {
  HASHRATE = "Hashrate",
  HASHRATE_PERFORMANCE = "Hashrate Performance",
  ATH_HASHRATE = "ATH",
  PEAK_HASHRATE = "Max Hashrate",
  AVG_1H_HASHRATE = "Avg 1H",
  AVG_7D_HASHRATE = "Avg 7D",
  BLOCKS_FOUND = "Blocks Found",
  TOTAL_BLOCKS_FOUND = "Total blocks found",
  TOTAL_BLOCKS_FOUND_SHORT = "Total",
  DAILY_BLOCKS_FOUND = "Daily blocks",
  EPOCH_BLOCKS_FOUND = "Epoch <number> blocks",
  MONERO_NETWORK_HASHRATE = "Monero Network Hashrate",
}

//APIs
export const MINING_STATS_URL = "/api/mining-stats";
export const CALCULATED_MINING_STATS_URL = "/api/calculated-mining-stats";

export const SWR_HOOK_DEFAULTS = {
  revalidateOnFocus: true,
  revalidateOnReconnect: false,
  revalidateIfStale: true,
  revalidateOnMount: true,
  refreshWhenHidden: false,
  refreshWhenOffline: false,
};
