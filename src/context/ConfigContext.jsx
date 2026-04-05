import { createContext, useContext } from "react";
import { useDoc } from "../hooks/useDoc";

const ConfigContext = createContext();

export function ConfigProvider({ children }) {
  const { data, loading, error } = useDoc("config", "site");

  return (
    <ConfigContext.Provider value={{ config: data, loading, error }}>
      {children}
    </ConfigContext.Provider>
  );
}

export function useConfig() {
  return useContext(ConfigContext);
}