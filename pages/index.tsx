import type { NextPage } from "next";
import Head from "next/head";
import React, { useCallback, useRef, useState } from "react";
import Button from "../components/button";
import FiltersPanel from "../components/filters-panel/FiltersPanel";
import { LineChart } from "../components/line-chart";
import Modal from "../components/modal";
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
  const {
    rawData = "",
    data,
    isInitialised,
    isLoading,
    initialise,
  } = useMatchData(filters);

  /**
   * store the status of the filters visiblity
   */
  const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false);

  /**
   * const is data modal open
   */
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
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

  /**
   * A handler function to open data editor
   */
  const onOpenDataModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  /**
   * A handler function to close data editor
   */
  const onCloseDataModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  /**
   * A handler function that handler the data updates
   */
  const onSubmitDataModal = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      const formData = new FormData(e.target as HTMLFormElement);

      // clear the existing filter before re-initializing the data
      setFilters(new Map<string, Set<string>>());

      initialise(formData.get("input_csv")?.toString());

      // close the modal
      setIsModalOpen(false);
    },
    [initialise]
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
            {hasData ? (
              <Button type="button" onClick={onOpenDataModal}>
                Edit Data
              </Button>
            ) : null}
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
          <LineChart data={data} isLoading={isLoading}>
            <div className="text-center">
              <label
                className="text-2xl underline underline-offset-2 p-5 cursor-pointer"
                htmlFor="input_data"
                role="button"
                tabIndex={0}
              >
                Upload the Data File
              </label>
              <div className="py-5">OR</div>
              <Button variant="text" onClick={onOpenDataModal}>
                Input CSV Data
              </Button>
            </div>
          </LineChart>
        </section>
        {isFiltersOpen && (
          <FiltersPanel
            filters={filters}
            teams={data?.teams}
            onFilterChange={onFilterChange}
            onFiltersClose={onFiltersClose}
          />
        )}
        {isModalOpen ? (
          <Modal
            onDismiss={onCloseDataModal}
            title="Input CSV Data"
            footer={
              <div className="flex justify-end space-x-5">
                <Button type="submit" form="csv_data_form" variant="primary">
                  Submit
                </Button>
                <Button type="reset" form="csv_data_form" value="cancel">
                  Cancel
                </Button>
              </div>
            }
          >
            <form
              id="csv_data_form"
              className=""
              onSubmit={onSubmitDataModal}
              onReset={onCloseDataModal}
            >
              <textarea
                name="input_csv"
                id="input_csv"
                defaultValue={rawData as string}
                className="w-full border border-gray-400 p-4"
                placeholder="Add your csv data here.."
                rows={10}
                autoFocus={true}
              ></textarea>
            </form>
          </Modal>
        ) : null}
      </main>
    </>
  );
};

export default Home;
