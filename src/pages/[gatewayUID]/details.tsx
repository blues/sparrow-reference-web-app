/* eslint-disable react/jsx-props-no-spreading */
import type { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import { useState } from "react";
import { changeGatewayName } from "../../api-client/gateway";
import GatewayDetails from "../../components/elements/GatewayDetails";
import { LoadingSpinner } from "../../components/layout/LoadingSpinner";
import { services } from "../../services/ServiceLocator";
import { getErrorMessage } from "../../constants/ui";
import { ERROR_CODES } from "../../services/Errors";

import GatewayDetailViewModel from "../../models/GatewayDetailViewModel";
import { getGatewayDetailsPresentation } from "../../components/presentation/gatewayDetails";

type GatewayDetailsData = {
  viewModel: GatewayDetailViewModel;
  err?: string;
};

const GatewayDetailsPage: NextPage<GatewayDetailsData> = ({
  viewModel,
  err,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const refreshData = async () => {
    await router.replace(router.asPath);
  };

  const changeName = async (name: string) => {
    if (name === viewModel.gateway?.serialNumber) return true;
    setIsLoading(true);
    const b = await changeGatewayName(viewModel.gateway?.uid || "", name);
    setIsLoading(false);
    await refreshData();
    return b;
  };

  return (
    <LoadingSpinner isLoading={isLoading}>
      <GatewayDetails
        onChangeName={changeName}
        viewModel={viewModel}
        err={err}
      />
    </LoadingSpinner>
  );
};

export default GatewayDetailsPage;

interface GatewayDetailsQueryInterface extends ParsedUrlQuery {
  gatewayUID: string;
}

export const getServerSideProps: GetServerSideProps<
  GatewayDetailsData
> = async ({ query }) => {
  const { gatewayUID } = query as GatewayDetailsQueryInterface;
  let viewModel: GatewayDetailViewModel = {};
  let err = "";

  try {
    const appService = services().getAppService();
    const gateway = await appService.getGateway(gatewayUID);
    const nodes = await appService.getNodes([gatewayUID]);
    viewModel = getGatewayDetailsPresentation(gateway, nodes);
  } catch (e) {
    err = getErrorMessage(
      e instanceof Error ? e.message : ERROR_CODES.INTERNAL_ERROR
    );
  }

  return {
    props: { viewModel, err },
  };
};
