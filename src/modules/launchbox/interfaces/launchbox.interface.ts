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
