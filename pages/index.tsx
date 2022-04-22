import type { NextPage } from "next";
import Head from "next/head";
import React, { useCallback, useState } from "react";
import Button from "../components/button";
import FiltersPanel from "../components/filters-panel/FiltersPanel";
import { LineChart } from "../components/line-chart";
import { useMatchData } from "../hooks/useMatchData";
import { Filters } from "../types";

const Home: NextPage = () => {
  /**
   * store the current state of the applied filters
   */
  const [filters, setFilters] = useState<Filters>(
    new Map<string, Set<string>>()
  );

  /**
   * data handler inputs/options
   */
  const { data, isInitialised, isLoading, initialise } = useMatchData(filters);

  /**
   * store the status of the filters visiblity
   */
  const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false);

  /**
   * A callback function that will be triggered when user uploads
   * a data file
   */
  const onFileChange = useCallback(
    (e: React.ChangeEvent<HTMLFormElement>) => {
      if (!e.target.files) {
        return;
      }

      /**
       * instantiate the file reader, and register the load event listener
       * //ToDo
       * //error handling
       */
      const reader = new FileReader();
      reader.onload = async function (e) {
        initialise(e.target?.result);
      };

      // read the csv file as text
      reader.readAsText(e.target.files[0]);
    },
    [initialise]
  );

  /**
   * A callback function data will reset the state of the UI
   */
  const onFormReset = useCallback(() => {
    initialise("");

    setFilters(new Map<string, Set<string>>());
  }, [initialise]);

  /**
   * Handler function to open the filters panel
   */
  const onFiltersOpen = useCallback(() => {
    setIsFiltersOpen(true);
  }, []);

  /**
   * Handler function to close the filters panel
   */
  const onFiltersClose = useCallback(() => {
    setIsFiltersOpen(false);
  }, []);

  /**
   * A callback function that will be triggered whenever a filter
   * changes
   */
  const onFilterChange = useCallback(
    (kind: string, id: string, newVal: boolean) => {
      setFilters((filters) => {
        // grab the existing filters for the given kind. If not available,
        // create the empty set
        let existingFilter = filters.get(kind);
        if (!existingFilter) {
          existingFilter = new Set<string>();
        }

        if (id === "all") {
          /**
           * if some filters are already selected, and if user
           * clicks on all, clear all the selected filters. This is equivalent
           * of selectin all filters
           */
          if (existingFilter.size) {
            existingFilter.clear();
          }
        } else {
          if (newVal) {
            existingFilter = existingFilter.add(id);
          } else {
            existingFilter.delete(id);
          }
        }

        filters.set(kind, existingFilter);

        return new Map(filters);
      });
    },
    []
  );

  const filtersCount = [
    filters.get("teams")?.size,
    filters.get("mode")?.size,
  ].filter(Boolean).length;

  const hasData = isInitialised && data?.teams.length;

  return (
    <>
      <Head>
        <title>Score Visualizer</title>
        <meta
          name="description"
          content="Visualizer for basketball match scores"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-col h-screen bg-indigo-100">
        <section className="flex justify-end items-center flex-shrink-0 px-5 pt-5 pb-10 space-x-4">
          <header className="flex-1">
            <h2 className="inline-block text-xl px-3 py-2 bg-white border-2 border-gray-500">
              ScoreViz
            </h2>
          </header>
          <form
            className="flex items-center space-x-4"
            onChange={onFileChange}
            onReset={onFormReset}
          >
            <input
              type="file"
              name="input_data"
              id="input_data"
              accept=".csv"
              hidden
            />
            {hasData ? <Button type="reset">Reset</Button> : null}
          </form>
          {hasData ? (
            <Button onClick={onFiltersOpen}>
              Filters
              {filtersCount > 0 ? (
                <span className="px-2 py-1 bg-indigo-400 text-white ml-2 rounded-full">
                  {filtersCount}
                </span>
              ) : null}
            </Button>
          ) : null}
        </section>
        <section className="flex-1">
          {hasData ? (
            <LineChart data={data} isLoading={isLoading} />
          ) : (
            <div className="h-full flex items-center justify-center flex-col">
              <label
                className="text-2xl p-5 rounded cursor-pointer hover:opacity-80 underline"
                htmlFor="input_data"
              >
                Upload the Data File
              </label>
              <p className="text-gray-600">No Data</p>
            </div>
          )}
        </section>
        {isFiltersOpen && (
          <FiltersPanel
            filters={filters}
            teams={data?.teams}
            onFilterChange={onFilterChange}
            onFiltersClose={onFiltersClose}
          />
        )}
      </main>
    </>
  );
};

export default Home;
