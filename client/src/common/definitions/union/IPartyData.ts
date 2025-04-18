export interface IPartyData {
  users?: IUserData[];
}

export interface IUserData {
  username: string;
  data: IUserGrailData;
}

export interface IUserGrailData {
  uniqueArmor?: ICategoryStatsData;
  uniqueWeapons?: ICategoryStatsData;
  uniqueOther?: ICategoryStatsData;
  sets?: ICategoryStatsData;
  runes?: ICategoryStatsData;
  itemScore?: number;
}

export interface ICategoryStatsData {
  missing: number;
  foundBits: string;
  itemScores: number[];
}
