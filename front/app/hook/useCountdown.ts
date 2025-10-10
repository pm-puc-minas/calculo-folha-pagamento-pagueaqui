import { useCallback, useState } from "react";
import { useCounter } from "./useCounter";
import { useInterval } from "./useInterval";

type CountdownOptions = {
  countStart: number;

  intervalMs?: number;
  isIncrement?: boolean;

  countStop?: number;
};

type CountdownControllers = {
  startCountdown: () => void;
  stopCountdown: () => void;
  resetCountdown: () => void;
};

export function useCountdown({
  countStart,
  countStop = 0,
  intervalMs = 1000,
  isIncrement = false,
}: CountdownOptions): [number, CountdownControllers] {
  const {
    count,
    increment,
    decrement,
    reset: resetCounter,
  } = useCounter(countStart);

  /*
   * Note: used to control the useInterval
   * running: If true, the interval is running
   * start: Should set running true to trigger interval
   * stop: Should set running false to remove interval.
   */
  const [isCountdownRunning, setIsCountdownRunning] = useState(false);

  // Will set running false and reset the seconds to initial value.
  const resetCountdown = useCallback(() => {
    setIsCountdownRunning(false);
    resetCounter();
  }, [setIsCountdownRunning, resetCounter]);

  const countdownCallback = useCallback(() => {
    if (count === countStop) {
      setIsCountdownRunning(false);
      return;
    }

    if (isIncrement) {
      increment();
    } else {
      decrement();
    }
  }, [
    count,
    countStop,
    decrement,
    increment,
    isIncrement,
    setIsCountdownRunning,
  ]);

  useInterval(countdownCallback, isCountdownRunning ? intervalMs : null);

  return [
    count,
    {
      startCountdown: () => setIsCountdownRunning(true),
      stopCountdown: () => setIsCountdownRunning(false),
      resetCountdown,
    },
  ];
}
