export const ABOUT_ME_NOTE =
  "Made by Marty De Viterbo habang nagkakape sa SM Dasma wahahaha -- May 18, 2025";
export const DONATE_X_URL =
  "https://explorer.qubic.org/network/address/DWAHBPNMHBEUYCXUCNDPZITBOEBAGKUGIOPFEBZSRDAWTCCHMWSGJZQGIFUM";

export const proxyUrl = (url: string): string =>
  `https://pro.cors.lol/?url=${url}&token=Ctln384fGdUX39Ld`;
export const isClient = typeof window !== "undefined";

export const QUBIC_URL = "qubic.org";
export const QUBIC_LIVE_STATS_URL = `https://rpc.${QUBIC_URL}/v1/latest-stats`;
export const QUBIC_XMR_STATS_URL = `https://xmr-stats.${QUBIC_URL}`;
export const QUBIC_XMR_STATS_API_URL = `${QUBIC_XMR_STATS_URL}/stats`;
export const EXPLORER_QUBIC_URL = `https://explorer.${QUBIC_URL}/network`;
const MONERO_MINING_POOLS_STATS_BASE_URL = "miningpoolstats.stream";
export const QUBIC_XMR_STREAMLIT_APP_URL =
  "https://qubic-xmr-stats.streamlit.app";

export const MONERO_MINING_LATEST_BLOCK_FOUND_URL = (seconds?: number) =>
  `https://${MONERO_MINING_POOLS_STATS_BASE_URL}/data/time?t=${seconds}`;
export const MONERO_MINING_POOLS_STATS_URL = (seconds: number) =>
  `https://data.${MONERO_MINING_POOLS_STATS_BASE_URL}/data/monero.js?t=${seconds}`;
export const MONERO_MINING_BLOCK_DISTRIBUTION_URL = (seconds: number) =>
  `https://data.${MONERO_MINING_POOLS_STATS_BASE_URL}/data/blocks/monero.js?t=${seconds}`;

const MEXC_URL = "https://api.mexc.com/api/v3";
const SAFE_TRADE_URL = "https://safetrade.com/api/v2";

/**
 * symbol: XMRUSDT
 * interval: 60m, 4h, 1d, 1w, 1m
 * startTime & endTime = 13-digit format
 */
export const MEXC_KLINES_URL = (
  symbol: string,
  interval: MEXCInterval,
  startTime: number,
  endTime: number,
) =>
  `${MEXC_URL}/klines?symbol=${symbol}&interval=${interval}&startTime=${startTime}&endTime=${endTime}`;

export const SAFE_TRADE_KLINES_URL = (
  id: string,
  period: SafeTradePeriod,
  time_from: number,
  time_to: number,
  limit: number,
) =>
  `${SAFE_TRADE_URL}/trade/public/markets/${id}/k-line?period=${period}&time_from=${time_from}&time_to=${time_to}&limit=${limit}`;

const QUBIC_RAILWAY_SERVER_URL = process.env.NEXT_PUBLIC_QUBIC_RAILWAY_SERVER;
export const QUBIC_RAILWAY_SERVER_ADVANCE_MINING_STATS = `${QUBIC_RAILWAY_SERVER_URL}/advance-mining-stats`;
export const QUBIC_RAILWAY_SERVER_ADVANCE_MINING_STATS_EVENT_STREAM = `${QUBIC_RAILWAY_SERVER_URL}/advance-mining-stats-event-stream`;

export const TARI_BLOCKS_HISTORY_URL =
  "https://tari-qubic-scanner.onrender.com";
export const TARI_BLOCKS_HISTORY_API_URL = `${TARI_BLOCKS_HISTORY_URL}/api/found_blocks`;

export const CFB_TOKEN_URL = "https://cfbtoken.com";
export const BUY_CFB_TOKEN_URL =
  "https://safetrade.com/exchange/CFB-USDT?type=basic";
export const CFB_TOKEN_X_URL = "https://x.com/c_f_b_token";
export const CFB_DISCORD_URL = "https://discord.com/invite/cAbXK8Kx35";

export const moneroTicker = "XMR";
export const tariTicker = "XTM";
export const blockToXMRConversion = 0.6;

export const enum Labels {
  HASHRATE = "Hashrate",
  HASHRATE_PERFORMANCE = "Hashrate Performance",
  ATH_HASHRATE = "ATH",
  PEAK_HASHRATE = "Max Hashrate",
  AVG_1H_HASHRATE = "Avg 1H",
  AVG_7D_HASHRATE = "Avg 7D",
  BLOCKS = "Blocks",
  BLOCKS_FOUND = "Blocks Found",
  BLOCKS_DISTRIBUTION = "Blocks Distribution",
  TOTAL_BLOCKS_FOUND = "Total blocks found",
  TOTAL_BLOCKS_FOUND_SHORT = "Total",
  DAILY_BLOCKS_FOUND = "Daily blocks",
  EPOCH_BLOCKS_FOUND = "Epoch <number> blocks",
  MONERO_NETWORK_HASHRATE = "Monero Network Hashrate",
}

export const enum MEXCInterval {
  ONE_HOUR = "60m",
  FOUR_HOURS = "4h",
  ONE_DAY = "1d",
  ONE_WEEK = "1w",
}

export const enum SafeTradePeriod {
  ONE_HOUR = 60,
  FOUR_HOURS = 240,
  ONE_DAY = 1440,
  ONE_WEEK = 10080,
}

export const SWR_HOOK_DEFAULTS = {
  revalidateOnFocus: true,
  revalidateOnReconnect: true,
  revalidateIfStale: true,
  revalidateOnMount: true,
  refreshWhenHidden: false,
  refreshWhenOffline: false,
};

// NOTE:
// mexc all trading pairs
// https://api.mexc.com/api/v3/defaultSymbols

// https://api.mexc.com/api/v3/klines?symbol=XMRUSDT&interval=60m&startTime=1742308800000&endTime=1742312400000
