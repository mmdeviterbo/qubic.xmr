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
  monero_block_distributions: {
    last1000Blocks: number;
    last100Blocks: number;
  };
};

export type MoneroBlockDistribution = {
  distribution: {
    interval: 1000;
    urls: {
      url: string;
      count: number;
    }[];
  };
  urls: {
    url: string;
    count: number;
  }[];
};

export interface AdvanceMiningStatsResponse {
  blocks: Omit<DailyChart, "reward">[];
  hashrates: MaxHashratesWeeklyChart[];
}

export type MaxHashratesWeeklyChart = {
  max_hashrate: number;
  epoch: number;
  timestamp: string;
};

export interface AdvanceMiningCharts {
  blocksChart: {
    daily: DailyChart[];
    weekly: WeeklyChart[];
  };
  hashratesChart: MaxHashratesWeeklyChart[];
}

export interface DailyChart {
  timestamp: string;
  blocks_found: number;
  reward: number;
  epoch?: number;
}

export interface WeeklyChart {
  blocks_found: number;
  epoch: number;
  reward: number;
  total_usdt: number;
}

//xtm - response
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

//xtm - transformed
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
  tari_block_distributions: {
    last1000Blocks: number;
    last100Blocks: number;
  };
};
