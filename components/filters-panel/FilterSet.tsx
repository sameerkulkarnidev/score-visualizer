import React from "react";

type Props = {
  /**
   * primary heading for the filter set
   */
  title: string;

  /**
   * A unique key for the all multi-select options
   */
  filterKey: string;

  /**
   * List of possible options
   */
  options: Array<{
    /**
     * unique identifier for an option
     */
    key: string;

    /**
     * User visible label for the option
     */
    label: string;
  }>;

  /**
   * Set of currently selected filters
   */
  selectedFilters?: Set<string>;
};

/**
 * A reusable component to have filters in multi-select, expand/collapse nature
 * @param props {Props} - props of the filter set component
 * @returns {JSX}
 */
const FilterSet = (props: Props) => {
  const { filterKey, title, selectedFilters, options } = props;

  /**
   * Consider all filters are selected if,
   * 1. selected filters are unavailable or its empty
   * 2. all options are actually selected
   */
  const areAllSelected =
    !selectedFilters ||
    selectedFilters?.size === 0 ||
    selectedFilters?.size === options.length;

  const selectionStatus = `${selectedFilters?.size || 0} of ${
    options.length
  } selected`;

  return (
    <details open>
      <summary>
        <span className="font-medium">{title} </span>
        <span className="float-right pr-2 text-indigo-600">
          {selectionStatus}
        </span>
      </summary>
      <div className="h-96 overflow-y-auto space-y-2 mt-2">
        <div key="all" className="flex items-center">
          <input
            id="all"
            type="checkbox"
            className="mr-3"
            name={filterKey}
            checked={areAllSelected}
            readOnly
          />
          <label className="block" htmlFor="all">
            All
          </label>
        </div>
        {options.map((opt) => (
          <div key={opt.key} className="flex items-center">
            <input
              id={opt.key}
              type="checkbox"
              className="mr-3"
              name={filterKey}
              checked={selectedFilters?.has(opt.key) || false}
              readOnly
            />
            <label className="block" htmlFor={opt.key}>
              {opt.label}
            </label>
          </div>
        ))}
      </div>
    </details>
  );
};

export default FilterSet;
