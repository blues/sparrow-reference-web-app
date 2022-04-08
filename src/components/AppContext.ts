import { createContext } from "react";
import Gateway from "./models/Gateway";

type AppContextType = {
  error: string;
  gateways: Gateway[];
};

const AppContext = createContext<AppContextType>({
  error: "",
  gateways: [],
});
export default AppContext;
