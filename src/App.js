import React from "react";
import {
  FormControl,
  TextField,
  InputLabel,
  MenuItem,
  Select
} from "@material-ui/core";
import "./styles.css";
import { useHotKey } from "./context/HotKeyContext";
import ChildComponent from "./ChildComponent";
import { Button } from "@material-ui/core";

export default function App() {
  const [val, setVal] = React.useState("");
  const [selectVal, setSelectVal] = React.useState(10);

  const [show, setShow] = React.useState(false);
  const [show2, setShow2] = React.useState(false);

  const [keypress, setKeypress] = React.useState("");
  const [background, setBackground] = React.useState({});
  const [size, setSize] = React.useState(400);

  const handleChange = e => {
    setVal(e.target.value);
  };

  const handleSelectChange = e => {
    setSelectVal(e.target.value);
  };

  const defaultFunc = e => {
    setKeypress(e.key.toLowerCase());
    setBackground({});
  };

  const shiftA = () => {
    setKeypress("Shortcut shift+a");
    const style = {
      backgroundColor: "#8EC5FC",
      backgroundImage: "linear-gradient(62deg, #8EC5FC 0%, #E0C3FC 100%)"
    };
    setBackground(style);
  };

  const ctrlD = () => {
    const style = {
      backgroundColor: "#08AEEA",
      backgroundImage: "linear-gradient(0deg, #08AEEA 0%, #2AF598 100%)"
    };
    setKeypress("Shortcut ctrl+d");
    setBackground(style);
  };

  const gB = () => {
    const style = {
      backgroundColor: "#F4D03F",
      backgroundImage: "linear-gradient(132deg, #F4D03F 0%, #16A085 100%)"
    };
    setKeypress("Shortcut g+b");
    setBackground(style);
  };

  const minus = () => {
    setKeypress("Shortcut shift+<");
    setSize(prevSize => prevSize - 30);
  };

  const plus = () => {
    setKeypress("Shortcut shift+>");
    setSize(prevSize => prevSize + 30);
  };

  const shiftBC = () => {
    setKeypress("Shortcut shift+b+c");
  };

  useHotKey("default", defaultFunc);
  useHotKey("shift+a", shiftA);
  useHotKey("g+b", gB);
  useHotKey("ctrl+d", ctrlD);
  useHotKey("shift+<", minus);
  useHotKey("shift+>", plus);
  useHotKey("shift+b+c", shiftBC);

  const sizeStyle = {
    width: `${size}px`,
    height: `${size}px`
  };

  return (
    <div className="App">
      <h1>Keyboard Shortcuts</h1>
      <h3 className="currentKey">
        <b className="currentKeyText">You pressed:</b>
        <div className="keypressdisplay">{keypress}</div>
      </h3>

      <div className="display">
        <div className="hotKeys">
          <h5 className="hotKeyTitle">Hot Keys</h5>
          <ul>
            <li>shift + a</li>
            <li>ctrl + d</li>
            <li>g + b</li>
            <li>shift + {"<"}</li>
            <li>shift + {">"}</li>
          </ul>
        </div>
        <div className="textArea">
          <h3>Disabled for:</h3>
          <h5>Text Area</h5>
          <TextField
            value={val}
            onChange={handleChange}
            multiline
            rows={3}
            variant="outlined"
          />
          <h5>Selects</h5>
          <FormControl>
            <InputLabel>Select</InputLabel>
            <Select value={selectVal} onChange={handleSelectChange}>
              <MenuItem value={10}>Armadillo</MenuItem>
              <MenuItem value={20}>Barn Swallow</MenuItem>
              <MenuItem value={30}>Capybara</MenuItem>
              <MenuItem value={40}>Dragonfly</MenuItem>
              <MenuItem value={50}>Electric Eel</MenuItem>
            </Select>
          </FormControl>
        </div>

        <div>
          <div className="playground" style={{ ...background, ...sizeStyle }}>
            Play Ground
          </div>
          <Button onClick={() => setShow(!show)}>Open Child</Button>
          <Button onClick={() => setShow2(!show2)}>Open Child 2</Button>
          {show && <ChildComponent number={1} />}
          {show2 && <ChildComponent number={2} />}
        </div>
      </div>
    </div>
  );
}
