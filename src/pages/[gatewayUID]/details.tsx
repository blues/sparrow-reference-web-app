/* eslint-disable react/jsx-props-no-spreading */
import { useState, useEffect } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import { changeGatewayName, useGateway } from "../../api-client/gateway";
import GatewayDetails from "../../components/elements/GatewayDetails";
import { LoadingSpinner } from "../../components/layout/LoadingSpinner";
import { getErrorMessage } from "../../constants/ui";
import { useNodes } from "../../api-client/node";
import NodeDetailViewModel from "../../models/NodeDetailViewModel";
import { getNodeDetailsPresentation } from "../../components/presentation/nodeDetails";

interface GatewayDetailsQueryInterface extends ParsedUrlQuery {
  gatewayUID: string;
}

const GatewayDetailsPage: NextPage = () => {
  const router = useRouter();
  const refreshData = async () => {
    await router.replace(router.asPath);
  };

  const [viewModel, setViewModel] = useState<NodeDetailViewModel>({});
  const [isLoading, setIsLoading] = useState(false);
  const [err, setErr] = useState<string | undefined>(undefined);
  const refetchInterval = 10000;

  const { query } = useRouter();
  const { gatewayUID } = query as GatewayDetailsQueryInterface;

  const {
    isLoading: gatewayLoading,
    error: gatewayErr,
    data: gateway,
  } = useGateway(gatewayUID, refetchInterval);

  const {
    isLoading: nodesLoading,
    error: nodeErr,
    data: nodes,
  } = useNodes([gatewayUID]);

  useEffect(() => {
    if (gatewayErr) {
      setErr(getErrorMessage(gatewayErr.message));
    }
    if (nodeErr) {
      setErr(getErrorMessage(nodeErr.message));
    }
    if (!nodeErr && !gatewayErr) {
      setErr(undefined);
    }
  }, [gatewayErr, nodeErr]);

  useEffect(() => {
    if (gatewayLoading) {
      setIsLoading(true);
    }
    if (nodesLoading) {
      setIsLoading(true);
    }
    if (!gatewayLoading && !nodesLoading) {
      setIsLoading(false);
    }
  }, [gatewayLoading, nodesLoading]);

  useEffect(() => {
    if (gateway && nodes) {
      const nodeModel: NodeDetailViewModel = getNodeDetailsPresentation(
        nodes,
        gateway
      );
      setViewModel(nodeModel);
    }
  }, [gateway, nodes]);

  const changeName = async (name: string) => {
    if (name === viewModel.gateway?.name) return true;
    setIsLoading(true);
    const isSuccessful = await changeGatewayName(
      viewModel.gateway?.uid || "",
      name
    );
    setIsLoading(false);
    await refreshData();
    return isSuccessful;
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
