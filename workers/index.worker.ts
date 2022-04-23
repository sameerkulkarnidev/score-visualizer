import {
  Filters,
  MatchEntry,
  MatchList,
  TeamsData,
  TimeSeriesEntry,
  TimeSeriesEntryData,
} from "../types";

const HOME_HEADER = "Home/Neutral";
const VISITOR_HEADER = "Visitor/Neutral";
const POINTS_HEADER = "PTS";
const DATE_HEADER = "Date";
const TIME_HEADER = "Start (ET)";

const MAPPED_KEYS: Record<string, string> = {
  [HOME_HEADER]: "home",
  [VISITOR_HEADER]: "visitor",
  [DATE_HEADER]: "date",
  [TIME_HEADER]: "time",
};

function getMappedKey(header: string) {
  return MAPPED_KEYS[header] || header;
}

function getTimeKey(obj: MatchEntry) {
  const date = obj.date;
  const time = obj.time;

  return new Date(`${date},${time}`).getTime();
}

function getDataByTeams(matchList: MatchList, filters: Filters) {
  const initialData: TeamsData = {};

  const selectedTeams = filters.get("teams");
  const selectedMode = filters.get("mode");

  return matchList.reduce((acc, val) => {
    if (val["home"] && val["visitor"]) {
      if (!acc[val["home"]]) {
        acc[val["home"]] = [];
      }

      if (!acc[val["visitor"]]) {
        acc[val["visitor"]] = [];
      }

      const time = getTimeKey(val);

      if (
        (!selectedTeams?.size || selectedTeams.has(val["home"])) &&
        (!selectedMode?.size || selectedMode.has("home"))
      ) {
        acc[val["home"]].push({
          name: val["home"],
          time,
          data: {
            mode: "home",
            points: val.pts_h,
          },
        });
      }

      if (
        (!selectedTeams?.size || selectedTeams.has(val["visitor"])) &&
        (!selectedMode?.size || selectedMode.has("visitor"))
      ) {
        acc[val["visitor"]].push({
          name: val["visitor"],
          time,
          data: {
            mode: "visitor",
            points: val.pts_v,
          },
        });
      }
    }

    return acc;
  }, initialData);
}

function getDataByTimeline(matchList: MatchList): Array<TimeSeriesEntry> {
  const timelineMap = matchList.reduce((acc, val) => {
    const timestamp = val.timestamp;
    let existingData = acc.get(timestamp);
    const newData: TimeSeriesEntryData = {
      [val.home]: {
        mode: "home",
        points: val.pts_h,
      },
      [val.home]: {
        mode: "home",
        points: val.pts_h,
      },
    };

    acc.set(timestamp, { ...existingData, ...newData });

    return acc;
  }, new Map<number, TimeSeriesEntryData>());

  const dataByTimeline: Array<TimeSeriesEntry> = [];
  timelineMap.forEach((values, key) => {
    dataByTimeline.push({
      timestamp: key,
      data: values,
    });
  });

  return dataByTimeline.sort((a, b) => a.timestamp - b.timestamp);
}

function getAllTeams(matchList: MatchList): Array<string> {
  const teamSet = matchList.reduce((acc, val) => {
    acc.add(val.home);
    acc.add(val.visitor);

    return acc;
  }, new Set<string>());

  const teams: string[] = [];

  teamSet.forEach((val) => {
    if (val) {
      teams.push(val);
    }
  });

  return teams;
}

function convertCSV(data: string): MatchList {
  const lines = data.split("\n");

  const results: MatchList = [];
  const headers: Array<keyof MatchEntry | "PTS"> = lines[0].split(",") as Array<
    keyof MatchEntry
  >;

  for (var i = 1; i < lines.length; i++) {
    const obj: any = {};
    const currentline: Array<string> = lines[i].split(",");

    let areVisitorPts = true;

    for (var j = 0; j < headers.length; j++) {
      const header = headers[j];
      const value = currentline[j];

      const key =
        header === POINTS_HEADER
          ? areVisitorPts
            ? "pts_v"
            : "pts_h"
          : getMappedKey(header);

      obj[key] = value;

      if (header === POINTS_HEADER && areVisitorPts) {
        areVisitorPts = false;
      }
    }
    obj.timestamp = getTimeKey(obj);

    if (obj.timestamp) {
      results.push(obj);
    }
  }

  return results;
}

onmessage = function (event: MessageEvent) {
  const { raw, filters } = event.data;
  const matchList = convertCSV(raw);

  const result = {
    matchList,
    teams: getAllTeams(matchList),
    dataByTimeline: getDataByTimeline(matchList),
    dataByTeam: getDataByTeams(matchList, filters),
  };

  postMessage(result);
};
