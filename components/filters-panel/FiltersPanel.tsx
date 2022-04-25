import React, { useCallback, useMemo } from "react";
import { Filters } from "../../types";
import FilterSet from "./FilterSet";

type Props = {
  /**
   * list of names of all the teams
   */
  teams?: string[];

  /**
   * Currently selected filters
   */
  filters: Filters;

  /**
   * A callback function that will be invoked when the user closes
   * the filter panel
   */
  onFiltersClose: () => void;

  /**
   * A callback function that will be invoked when a filter is added or
   * removed
   */
  onFilterChange: (
    /**
     * type if filter that is updated
     */
    kind: string,

    /**
     * identifier of the filter option that is updated
     */
    id: string,

    /**
     * new value for the updated option
     */
    newVal: boolean
  ) => void;
};

const MODE_OPTIONS = [
  { key: "home", label: "Home" },
  { key: "visitor", label: "Visitor" },
];

/**
 * A component that houses all the possible filters for the given data
 * @param props {Props} - possible props of the FilterPanel
 * @returns {JSX}
 */
const FiltersPanel = (props: Props) => {
  const { teams = [], filters, onFilterChange, onFiltersClose } = props;

  /**
   * we don't need to compute the team options on every render, so, memoize
   * those!
   */
  const TEAM_OPTIONS = useMemo(() => {
    return teams.map((team) => ({ label: team, key: team }));
  }, [teams]);

  /**
   * A callback function that will be triggered when a filter is added or
   * removed
   */
  const onChange = useCallback(
    (e: any) => {
      const kind = e.target.name;
      const id = e.target.id;
      const isChecked = e.target.checked;

      onFilterChange(kind, id, isChecked);
    },
    [onFilterChange]
  );

  return (
    <>
      {/* filter panel's backdrop */}
      <section
        className="fixed right-0 h-full w-full bg-black/60"
        data-testid="back-drop"
        onClick={onFiltersClose}
      ></section>
      <form
        className="fixed right-0 h-full bg-white w-64 border-l border-gray-500 py-5 pl-5 space-y-5"
        onChange={onChange}
      >
        <header className="text-xl font-medium">Filters</header>
        <FilterSet
          filterKey="teams"
          title="Teams"
          options={TEAM_OPTIONS}
          selectedFilters={filters.get("teams")}
        />
        <FilterSet
          filterKey="mode"
          title="Played As"
          options={MODE_OPTIONS}
          selectedFilters={filters.get("mode")}
        />
      </form>
    </>
  );
};

export default FiltersPanel;
