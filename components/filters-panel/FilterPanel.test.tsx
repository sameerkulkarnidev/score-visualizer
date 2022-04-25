import { render, screen } from "@testing-library/react";
import FiltersPanel from "./FiltersPanel";

test("should render teams and mode filters correctly", () => {
  const onFilterChange = jest.fn();
  const onFiltersClose = jest.fn();

  const selectedFilters = new Map<string, Set<string>>();

  const teams = ["team 1", "team 2"];

  render(
    <FiltersPanel
      teams={teams}
      filters={selectedFilters}
      onFiltersClose={onFiltersClose}
      onFilterChange={onFilterChange}
    />
  );

  teams.forEach((team) => {
    const checkbox = screen.getByLabelText(team);
    expect(checkbox).not.toBeChecked();
  });

  ["Home", "Visitor"].forEach((team) => {
    const checkbox = screen.getByLabelText(team);
    expect(checkbox).not.toBeChecked();
  });
});

test("should invoke onFiltersChange correctly", () => {
  const onFilterChange = jest.fn();
  const onFiltersClose = jest.fn();

  const selectedFilters = new Map<string, Set<string>>();

  const teams = ["team 1", "team 2"];

  render(
    <FiltersPanel
      teams={teams}
      filters={selectedFilters}
      onFiltersClose={onFiltersClose}
      onFilterChange={onFilterChange}
    />
  );

  const checkbox = screen.getByLabelText(teams[0]);
  checkbox.click();

  expect(onFilterChange).toHaveBeenCalledWith("teams", teams[0], true);
});

test("should invoke onFiltersClose correctly", () => {
  const onFilterChange = jest.fn();
  const onFiltersClose = jest.fn();

  const selectedFilters = new Map<string, Set<string>>();

  const teams = ["team 1", "team 2"];

  render(
    <FiltersPanel
      teams={teams}
      filters={selectedFilters}
      onFiltersClose={onFiltersClose}
      onFilterChange={onFilterChange}
    />
  );

  const backDrop = screen.getByTestId("back-drop");
  backDrop.click();

  expect(onFiltersClose).toHaveBeenCalled();
});
