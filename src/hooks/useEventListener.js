import React from "react";
import useCurrentRef from "./useCurrentRef";

/**
 * Handles mounting and unmounting of event listeners
 * @param {string} event - Event key ex. "keypress" or "mouseup"
 * @param {function} callback - Callback to be called when event fires
 */

const useEventListener = (event, callback) => {
  const callbackRef = useCurrentRef(callback);
  React.useEffect(() => {
    const eventCallback = props => {
      callbackRef.current(props);
    };
    window.addEventListener(event, eventCallback);
    return () => {
      window.removeEventListener(event, eventCallback);
    };
    /**
     * callbackRef is a mutable object so it will never trigger a rerender.
     */
  }, [event, callbackRef]);
};

export default useEventListener;
