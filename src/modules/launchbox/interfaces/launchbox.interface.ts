
export interface Chain {
  id: number;
  name: string;
  deployer_address: string;
  transaction_hash: string;
  block_number: number;
}

export interface Social {
  [key: string]: {
    channel: {
      channel_id: string;
      name: string;
      url: string;
    };
  };

}

export interface ILaunchboxTokenLeaderboard {
  id: string;
  token_id: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  incentives: IIncentiveChannel[];
}



export interface IIncentiveChannel {
  id: string;
  name: string;
  info: string;
  actions: IIncentiveAction[];
}

export interface IIncentiveAction {
  id: string;
  name: string;
  description: string;
  points: number
}

export interface ILeaderboardParticipant {
  id: string;
  associated_address: string;
  leaderboard_id: string;
  created_at: Date;
  updated_at: Date;
  completed_actions: IIncentiveAction[];

}
