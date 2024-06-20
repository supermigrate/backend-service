export interface Channel {
  createdAtTimestamp: string;
  channelId: string;
  name: string;
  description: string;
  imageUrl: string;
  leadIds: string[];
  url: string;
  dappName: string;
  followerCount: number;
}
