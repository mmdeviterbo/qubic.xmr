import { Dispatch, SetStateAction, useEffect } from "react";

const useServerSentEvents = <T>(
  callback: (state: T) => Promise<void>,
  url: string,
) => {
  useEffect(() => {
    const eventSource = new EventSource(url);

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      void callback(data);
    };

    eventSource.onerror = (err) => {
      console.error(`Server Sent Events error on ${url}:`, err);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);
};

export default useServerSentEvents;
