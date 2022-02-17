import { GetServerSideProps, NextPage } from "next";
import { ParsedUrlQuery } from "querystring";
import { useState } from "react";
import { useRouter } from "next/router";
import { getErrorMessage } from "../../../../components/constants/ui";
import { services } from "../../../../services/ServiceLocator";
import SensorDetailViewModel from "../../../../models/SensorDetailViewModel";
import { getSensorDetailsPresentation } from "../../../../components/presentation/sensorDetails";
import { ERROR_CODES } from "../../../../services/Errors";
import SensorDetails from "../../../../components/elements/SensorDetails";
import { changeSensorName } from "../../../../api-client/sensor";
import { LoadingSpinner } from "../../../../components/layout/LoadingSpinner";

// custom interface to avoid UI believing query params can be undefined when they can't be
interface SparrowQueryInterface extends ParsedUrlQuery {
  gatewayUID: string;
  sensorUID: string;
}

type SensorDetailsPageProps = {
  err?: string;
  gatewayUID: string;
  sensorUID: string;
  viewModel: SensorDetailViewModel;
};

const SensorDetailsPage: NextPage<SensorDetailsPageProps> = ({
  err,
  gatewayUID,
  sensorUID,
  viewModel,
}) => {
  // TODO (carl) Isolate this edit-in-place [isLoading] logic into a separate
  // component which has no knowldege of NextJS (not in `/pages`) when we soon
  // use it elsewhere.
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  // Call this function whenever you want to
  // refresh props!
  const refreshData = async () => {
    await router.replace(router.asPath);
  };

  const changeName = async (name: string) => {
    if (name === viewModel.sensor?.name) return true;
    setIsLoading(true);
    const b = await changeSensorName(gatewayUID, sensorUID, name);
    setIsLoading(false);
    await refreshData();
    return b;
  };
  return (
    <LoadingSpinner isLoading={isLoading}>
      <SensorDetails
        viewModel={viewModel}
        err={err || ""}
        onChangeName={changeName}
      />
    </LoadingSpinner>
  );
};

export default SensorDetailsPage;

export const getServerSideProps: GetServerSideProps<SensorDetailsPageProps> =
  async ({ query }) => {
    const { gatewayUID, sensorUID } = query as SparrowQueryInterface;
    const appService = services().getAppService();
    let viewModel: SensorDetailViewModel = {};
    let err = "";

    try {
      const gateway = await appService.getGateway(gatewayUID);
      const sensor = await appService.getSensor(gatewayUID, sensorUID);
      const readings = await appService.getSensorData(gatewayUID, sensorUID);
      viewModel = getSensorDetailsPresentation(sensor, gateway, readings);
    } catch (e) {
      err = getErrorMessage(
        e instanceof Error ? e.message : ERROR_CODES.INTERNAL_ERROR
      );
    }
    return {
      props: { err, viewModel, gatewayUID, sensorUID },
    };
  };
