import React from "react";
import useEventListener from "../hooks/useEventListener";
import useCurrentRef from "../hooks/useCurrentRef";

/**
 *
 * @param {string} comboStr- A string representing the key combo ex. "shift+a+b"
 * @param {*} event- Keyboard Event
 * @param {*} prevKey- The previously pressed key (if it hasn't been released)
 */
const matchesKeyCombo = (comboStr, event, prevKey) => {
  const { shiftKey, altKey, ctrlKey, metaKey } = event;
  const comboStrArr = comboStr.split("+").map(str => str.trim().toLowerCase());
  let matchShift = comboStrArr.includes("shift") === shiftKey;
  let matchCtrl = comboStrArr.includes("ctrl") === ctrlKey;
  let matchAlt = comboStrArr.includes("alt") === altKey;
  let matchMeta = comboStrArr.includes("meta") === metaKey;

  const withoutModKeys = comboStrArr.filter(
    str => str !== "shift" && str !== "ctrl" && str !== "alt" && str !== "meta"
  );
  if (
    withoutModKeys.length > 2 ||
    withoutModKeys.filter(key => key.length !== 1).length > 0
  ) {
    console.error(
      "Only combinations of 2 keys separated by a + and modifiers are allowed ex. 'shift+a+b'. Keycombo " +
        comboStr +
        " is not valid"
    );
  }

  let isCorrectKeyCombo;
  if (withoutModKeys.length === 2) {
    const hasCurrentKey = withoutModKeys.includes(event.key.toLowerCase());
    const hasPrevKey = Boolean(prevKey) && withoutModKeys.includes(prevKey);
    isCorrectKeyCombo = hasCurrentKey && hasPrevKey;
  } else {
    isCorrectKeyCombo = withoutModKeys.includes(event.key.toLowerCase());
  }
  return isCorrectKeyCombo && matchShift && matchCtrl && matchAlt && matchMeta;
};

const HotKeyContext = React.createContext({});

const HotKeyProvider = props => {
  const hotKeyMapRef = React.useRef({});
  // Allows for combinations of 2 non-mod keys. ex. a+b
  const prevPressedKey = React.useRef(null);

  const addHotKey = (hotkeyItem, callback) => {
    if (!hotKeyMapRef.current[hotkeyItem]) {
      hotKeyMapRef.current = {
        ...hotKeyMapRef.current,
        [hotkeyItem]: [callback]
      };
    } else {
      hotKeyMapRef.current = {
        ...hotKeyMapRef.current,
        [hotkeyItem]: [...hotKeyMapRef.current[hotkeyItem], callback]
      };
    }
  };

  const removeHotKey = (hotKey, callback) => {
    if (!hotKeyMapRef.current[hotKey]) return;
    hotKeyMapRef.current = {
      ...hotKeyMapRef.current,
      [hotKey]: hotKeyMapRef.current[hotKey].filter(call => call !== callback)
    };
    if (hotKeyMapRef.current[hotKey].length === 0) {
      delete hotKeyMapRef.current[hotKey];
    }
  };

  const keyPressCallback = e => {
    if (e.target.tagName !== "INPUT" && e.target.tagName !== "TEXTAREA") {
      Object.entries(hotKeyMapRef.current).forEach(item => {
        const [keyCombo, callbackArr] = item;
        if (
          keyCombo === "default" ||
          matchesKeyCombo(keyCombo, e, prevPressedKey.current)
        ) {
          callbackArr.map(callback => callback(e));
        }
      });
      prevPressedKey.current = e.key.toLowerCase();
    }
  };

  const keyUp = e => {
    if (prevPressedKey.current === e.key) {
      prevPressedKey.current = null;
    }
  };

  useEventListener("keypress", keyPressCallback);
  useEventListener("keyup", keyUp);

  return (
    <HotKeyContext.Provider value={{ addHotKey, removeHotKey }} {...props} />
  );
};

/**
 *
 * @param {string} hotKey - A string representing the shortcut key combo.
 * Valid inputs include any singular key with "shift", "ctrl", "alt", and "meta"
 * HotKeys are sensitive to whether or not modkeys are in the combination.
 * Not case sensitive
 * @param {function} callback - Any function to be called on when hotkey is pressed
 * The function should take in a keyboard event object.
 */

const useHotKey = (hotKey, callback) => {
  const context = React.useContext(HotKeyContext);
  const contextRef = useCurrentRef(context);
  const callbackRef = useCurrentRef(callback);

  if (context === undefined) {
    throw new Error("useHotKey must be used within a HotKeyProvider");
  }

  React.useEffect(() => {
    const keypressCallback = e => {
      callbackRef.current(e);
    };
    const removeCallback = () => {
      contextRef.current.removeHotKey(hotKey, keypressCallback);
    };
    contextRef.current.addHotKey(hotKey, keypressCallback);
    return () => {
      removeCallback();
    };
    /**
     * useCurrentRef returns a mutable object that will never trigger a rerender.
     */
  }, [hotKey, contextRef, callbackRef]);
};

/**
 * Usage:
 * Wrap any components that need access to hotKeys in HotKeyProvider, preferable on app level
 * ex:
 *  <HotKeyProvider>
 *    <App />
 *  </HotKeyProvider>
 *
 * Import useHotKey at the component as necessary
 * ex.
 * import {useHotKey} from "../context/HotKeyContext"
 *
 * Use the useHotKey hook in that component
 * ex.
 *
 * const callback = () => {
 *  //Do some logic here like opening a drawer
 *  setOpen(true)
 * }
 *
 * useHotKey("shift+o", callback)
 *
 * Repeat for any hot keys needed.
 */

export { HotKeyProvider, useHotKey };
