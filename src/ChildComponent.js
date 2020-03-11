import React from "react";
import { useHotKey } from "./context/HotKeyContext";

const ChildComponent = ({ number }) => {
  const [val, setVal] = React.useState("");

  const setNewVal = () => {
    setVal(Math.random());
  };

  useHotKey("shift+t", setNewVal);

  return (
    <div>
      Child Component {number}: {val}
    </div>
  );
};

export default ChildComponent;
