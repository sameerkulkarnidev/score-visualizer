import { render, screen } from "@testing-library/react";
import FilterSet from "./FilterSet";

const options = [
  { key: "opt1", label: "Opt 1" },
  { key: "opt2", label: "Opt 2" },
];

test("FilterSet - no selected filter", () => {
  render(<FilterSet title="a" filterKey="test" options={options} />);

  const allCheckbox = screen.getByLabelText("All");
  expect(allCheckbox).toBeChecked();

  options.forEach((opt) => {
    const checkbox = screen.getByLabelText(opt.label);
    expect(checkbox).not.toBeChecked();
  });
});

test("FilterSet - with selected filter", () => {
  render(
    <FilterSet
      title="a"
      filterKey="test"
      options={options}
      selectedFilters={new Set([options[0].key])}
    />
  );

  const allCheckbox = screen.getByLabelText("All");
  expect(allCheckbox).not.toBeChecked();

  options.forEach((opt) => {
    const checkbox = screen.getByLabelText(opt.label);

    if (opt.key === options[0].key) {
      expect(checkbox).toBeChecked();
    } else {
      expect(checkbox).not.toBeChecked();
    }
  });
});

test("FilterSet - form change listner", () => {
  const fn = jest.fn((e) => {
    expect(e.target.id).toBe(options[0].key);
  });

  render(
    <form onChange={fn}>
      <FilterSet
        title="a"
        filterKey="test"
        options={options}
        selectedFilters={new Set([])}
      />
    </form>
  );

  const allCheckbox = screen.getByLabelText("All");
  expect(allCheckbox).toBeChecked();

  const opt1 = screen.getByLabelText(options[0].label);
  opt1.click();

  expect(fn).toHaveBeenCalled();
});
