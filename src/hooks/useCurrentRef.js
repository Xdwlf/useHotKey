import React from "react";

/**
 * Keeps a reference of the most current version of any value.
 * Useful for callback equality
 */
const useCurrentRef = currentVal => {
  const currentRef = React.useRef(currentVal);
  React.useEffect(() => {
    currentRef.current = currentVal;
  });
  return currentRef;
};

export default useCurrentRef;
