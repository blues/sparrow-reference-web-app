import { NextPage } from "next";
import { useContext } from "react";
import AppContext from "../components/AppContext";

import styles from "../styles/Home.module.scss";

const Home: NextPage = () => {
  const appContext = useContext(AppContext);
  return appContext.error ? (
    <h2 className={styles.errorMessage}>{appContext.error}</h2>
  ) : (
    <>&nbsp;</>
  );
};

export default Home;
