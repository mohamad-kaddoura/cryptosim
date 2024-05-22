import { createContext, useReducer, useContext } from "react";

import { CryptoGranularity } from "../services/crypto";

export interface CandleData {
  time: number;
  low: number;
  high: number;
  open: number;
  close: number;
  average: number;
  volume: number;
}

interface GlobalContext {
  granularity: CryptoGranularity;
  data: CandleData[];
}

export const globalObject: GlobalContext = {
  granularity: CryptoGranularity.one_day,
  data: [],
};

export const globalContext = createContext(globalObject);
export const dispatchContext = createContext<any>(undefined);

export default function GlobalStateProvider({ children }: { children: any }) {
  const [state, dispatch] = useReducer(
    (state: any, newValue: any) => ({ ...state, ...newValue }),
    globalObject
  );
  return (
    <globalContext.Provider value={state}>
      <dispatchContext.Provider value={dispatch}>
        {children}
      </dispatchContext.Provider>
    </globalContext.Provider>
  );
}

export const useGlobalContext = () => {
  return {
    context: useContext(globalContext),
    setContext: useContext<(newState: GlobalContext) => void>(dispatchContext),
  };
};
