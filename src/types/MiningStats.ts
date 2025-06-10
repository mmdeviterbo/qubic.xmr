export type About = {
  developer?: string;
};

export type MiningStats = About & {
  pool_hashrate: number;
  pool_hashrate_ranking: number | null;
  round_hashes: number;
  network_hashrate: number;
  network_difficulty: number;
  network_height: number;
  last_template_fetched: number;
  last_block_found: number;
  pool_blocks_found: number;
  payment_threshold: number;
  pool_fee: number;
  pool_port: number;
  pool_ssl_port: number;
  allow_self_select: number;
  connected_miners: number;
  miner_hashrate: number;
  miner_hashrate_stats: [number, number, number, number, number, number];
  miner_balance: number;
  worker_count: number;
  mined_block_info: {
    last_20_mined_blocks: number[];
    last_update: number;
  };
  hashrate_average_1h: number;
  hashrate_average_7d: number;
  max_hashrate: number;
  max_hashrate_last_update: string;
  max_hashrate_last_epoch: number;
  daily_blocks_found: number;
  epoch_blocks_found: number;
  epoch: number;
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

export type CalculatedMiningStats = Pick<
  MiningStats,
  | "daily_blocks_found"
  | "epoch_blocks_found"
  | "epoch"
  | "max_hashrate"
  | "max_hashrate_last_update"
  | "max_hashrate_last_epoch"
> & {
  historyCharts: XMRHistoryCharts;
};

export type XMRHistoryCharts = {
  blocks_found_chart: {
    daily: [
      {
        timestamp: string;
        blocks_found: number;
      },
    ];
    weekly: [
      {
        blocks_found: number;
        epoch: number;
      },
    ];
  };
  max_hashrates_chart?: [
    {
      max_hashrate: number;
      epoch: number;
    },
  ];
};

export interface XTMMiningHistory {
  block: number;
  timestamp: string;
  reward: number;
}

export type XTMHistoryCharts = {
  pool_blocks_found: number;
  last_block_found: string;
  total_xtm: number;
  blocks_found_chart: {
    daily: [
      {
        timestamp: string;
        blocks_found: number;
        reward: number;
      },
    ];
    weekly: [
      {
        epoch: number;
        blocks_found: number;
        reward: number;
      },
    ];
  };
};
