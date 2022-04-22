import React from "react";
import { Filters, WorkerResults } from "../types";
import { useWorker } from "./useWorker";

/**
 * Reusable hook to parse and access the match data
 */
export function useMatchData(filters?: Filters) {
  /**
   * store the received raw data
   */
  const [rawData, setRawData] = React.useState<
    string | ArrayBuffer | null | undefined
  >();

  /**
   * store the parsed raw data
   */
  const [data, setData] = React.useState<WorkerResults>();

  /**
   * a flag to track initialization of the data
   */
  const [isInitialised, setIsInitialised] = React.useState<boolean>(false);

  /**
   * a flag to track if the data is not ready
   */
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  /**
   * A callback function that will be invoked when worked completes the
   * dattaa processing
   */
  const onWorkerMessage = React.useCallback((e: MessageEvent) => {
    setData(e.data);

    setIsInitialised(true);
    setIsLoading(false);
  }, []);

  /**
   * Grab a reference to the worker
   */
  const worker = useWorker(onWorkerMessage);

  /**
   * A function that will send worker the given data
   */
  const initialise = React.useCallback(
    function (input?: string | ArrayBuffer | null) {
      setRawData(input);

      worker?.postMessage({ raw: input, filters });
    },
    [filters, worker]
  );

  /**
   * A handler to trigger the computations whenever filter changes
   */
  React.useEffect(() => {
    if (rawData) {
      /**
       * Trigger the computations with the applied filters
       */
      worker?.postMessage({ raw: rawData, filters });
    }
  }, [filters, rawData, worker]);

  return { rawData, data, isInitialised, isLoading, initialise };
}
