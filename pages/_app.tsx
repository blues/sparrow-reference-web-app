import "../styles/globals.css";
import type { AppProps } from "next/app";

require("../styles/antd-variables.less");

const MyApp = function ({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
};

export default MyApp;
