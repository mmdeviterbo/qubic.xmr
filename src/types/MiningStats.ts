export type About = {
  developer?: string;
};

export type MiningStats = About & {
  pool_hashrate: number;
  pool_hashrate_ranking: number | null;
  network_hashrate: number;
  connected_miners: number;
  monero_blocks_found: {
    last_block_found: number;
    pool_blocks_found: number;
    total_rewards: number;
  };
  hashrate_averages: {
    hashrate_average_1h: number;
    hashrate_average_7d: number;
  };
};

export interface XMRMiningHistory {
  index?: number;
  timestamp: string; //utc already
  pool_hashrate: `${number}`;
  network_hashrate: `${number}`;
  pool_blocks_found: `${number}`;
  timestamp_hour: string; //utc hour already
  close: `${number}`;
  qubic_usdt: `${number}`;
  qubic_epoch: `${number}`;

  // timestamp: '2025-05-28 09:18:42',
  // pool_hashrate: '1039550',
  // network_hashrate: '5341422420',
  // pool_blocks_found: '73',
  // timestamp_hour: '2025-05-28 09:00:00',
  // close: '345.89',
  // qubic_usdt: '1.5003e-06',
  // qubic_epoch: '162'
}

export type CalculatedMiningStats = {
  epoch: number;
  max_hashrate_stats: {
    max_hashrate: number;
    max_hashrate_last_update: string;
    max_hashrate_last_epoch: number;
  };
  monero_history_charts: XMRHistoryCharts;
  tari_blocks_found: XTMHistoryCharts["tari_blocks_found"];
  tari_history_charts: XTMHistoryCharts["blocks_found_chart"];
};

interface DailyChart {
  timestamp: string;
  blocks_found: number;
  reward: number;
}

interface WeeklyChart {
  blocks_found: number;
  epoch: number;
  reward: number;
}

export type XMRHistoryCharts = {
  blocks_found_chart: {
    daily: DailyChart[];
    weekly: WeeklyChart[];
  };
  max_hashrates_chart?: {
    max_hashrate: number;
    epoch: number;
  }[];
};

export interface XTMMiningHistory {
  blocks: {
    block_height: number;
    timestamp: string;
    reward: number;
  }[];
  blocks_found_this_epoch: number;
  last_scanned_height: number;
  reward_this_epoch: number;
  total_found: number;
}

export type XTMHistoryCharts = {
  tari_blocks_found: {
    pool_blocks_found: number;
    last_block_found: string;
    total_rewards: number;
  };
  blocks_found_chart: {
    daily: DailyChart[];
    weekly: WeeklyChart[];
  };
};
