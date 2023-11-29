import { useState, useEffect, useRef } from "react";

// useLongPress Hook
function useLongPress(callback = () => {}, ms = 300) {
  // add states
  const [startLongPress, setStartLongPress] = useState(false);

  // timer reference
  const timerRef = useRef();

  // side effect
  useEffect(() => {
    if (startLongPress) {
      // call callback function passed in after timeout
      timerRef.current = setTimeout(callback, ms);
    } else {
      clearTimeout(timerRef.current);
    }

    return () => {
      clearTimeout(timerRef.current);
    };
  }, [callback, ms, startLongPress]);

  return {
    onMouseDown: () => setStartLongPress(true),
    onMouseUp: () => setStartLongPress(false),
    onMouseLeave: () => setStartLongPress(false),
    onTouchStart: () => setStartLongPress(true),
    onTouchEnd: () => setStartLongPress(false),
  };
}

export default useLongPress;
