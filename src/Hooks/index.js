import { useEffect, useRef } from "react";

export const useKeyDown = (key, cb) => {
  const callBackRef = useRef(cb);

  useEffect(() => {
    callBackRef.current = cb;
  });

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.code === key) {
        callBackRef.current(e);
      }
    }
    document.addEventListener("keypress", handleKeyDown);

    return () => document.removeEventListener("keypress", handleKeyDown);
  }, [key]);
};
