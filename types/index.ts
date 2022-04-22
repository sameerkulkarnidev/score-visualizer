export type MatchEntry = {
  /**
   * timestamp for a match entry
   */
  timestamp: number;

  /**
   * name of the home team
   */
  home: string;

  /**
   * name of the visitor team
   */
  visitor: string;

  /**
   * date string for the match
   */
  date: string;

  /**
   * time string for the match
   */
  time: string;

  /**
   * points scored by the home team
   */
  pts_h: number;

  /**
   * points scored by the visitor team
   */
  pts_v: number;
};

/**
 * kind to filter set mapping
 */
export type Filters = Map<string, Set<string>>;

/**
 * list of match entries
 */
export type MatchList = Array<MatchEntry>;

/**
 * time series data object
 */
export type TimeSeriesTeamData = {
  points: number;
  mode: string;
};

export type TeamID = string;

/**
 * score stats for a team, along with their mode
 */
export type MatchStats = {
  mode: "home" | "visitor";
  points: number;
};

/**
 * a map of team to match stats
 */
export type TimeSeriesEntryData = {
  [key: TeamID]: MatchStats;
};

/**
 * an entry in time series data
 */
export type TimeSeriesEntry = {
  timestamp: number;

  data: TimeSeriesEntryData;
};

/**
 * Team -> time series data
 */
export type TeamsData = {
  [key: TeamID]: Array<{
    time: number;
    data: MatchStats;
  }>;
};

/**
 * while collection of data that is retured by the worked
 * Probably, this type can have some better name!!
 */
export type WorkerResults = {
  teams: string[];

  matchList: MatchList;

  dataByTimeline: TimeSeriesEntry[];

  dataByTeam: TeamsData;
};
