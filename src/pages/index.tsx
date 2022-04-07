import { GetServerSideProps, NextPage } from "next";
import { services } from "../services/ServiceLocator";
import { getErrorMessage } from "../constants/ui";
import { ERROR_CODES, isError, MayError } from "../services/Errors";
import { Project } from "../services/AppModel";
import styles from "../styles/Home.module.scss";

type HomeData = MayError<
  {
    project: Project;
  },
  string
>;

const Home: NextPage<HomeData> = (homeData: HomeData) => {
  let body;

  if (isError(homeData)) {
    const { err } = homeData;
    body = <h2 className={styles.errorMessage}>{err}</h2>;
  } else {
    const { project } = homeData;
    const { gateways } = project;
    body = <h2>Main content here... eventually.</h2>;
  }

  return <div className={styles.container}>{body}</div>;
};
export default Home;

export const getServerSideProps: GetServerSideProps<HomeData> = async () => {
  try {
    const appService = services().getAppService();
    const project = await appService.getLatestProjectReadings();
    return {
      props: { project },
    };
  } catch (e) {
    return {
      props: {
        err: getErrorMessage(
          e instanceof Error ? e.message : ERROR_CODES.INTERNAL_ERROR
        ),
      },
    };
  }
};
