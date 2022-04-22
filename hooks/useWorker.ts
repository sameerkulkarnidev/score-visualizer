import React from "react";

/**
 * A reusable hook which spawns a worker and return the reference to it
 * @param onMessage {Function} - a callback function that will be registered as
 * a message listener
 * @returns {Worker} - worker instance
 */
export function useWorker(onMessage: (e: MessageEvent) => void) {
  const [worker, setWorker] = React.useState<Worker>();

  React.useEffect(() => {
    // load the worker
    const w = new Worker(new URL("../workers/index.worker", import.meta.url));

    // set the on message listener given by the consumer
    w.onmessage = onMessage;

    setWorker(w);

    return () => {
      // terminate the worker whenever the hook get cleaned up
      w.terminate();
    };
  }, [onMessage]);

  return worker;
}
