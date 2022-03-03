import Gateway from "../../../src/components/models/Gateway";
import Node from "../../../src/components/models/Node";
import NodeDetailViewModel from "../../../src/models/NodeDetailViewModel";
import AppService from "../../../src/services/AppService";
import { DataProvider } from "../../../src/services/DataProvider";
import sparrowData from "./__serviceMocks__/sparrowData.json";

describe("App Service", () => {
  let dataProviderMock: DataProvider;
  let appServiceMock: AppService;

  const { mockedGatewayUID, mockedNodeId } = sparrowData;

  const mockedGatewaySparrowData =
    sparrowData.successfulGatewaySparrowDataResponse as Gateway;

  const mockedGatewaysSparrowData = [
    sparrowData.successfulGatewaySparrowDataResponse as Gateway,
  ];

  const mockedNodeSparrowData =
    sparrowData.successfulNodeSparrowDataResponse as Node[];

  const mockedNodesSparrowData = [
    sparrowData.successfulNodeSparrowDataResponse as Node[],
  ];

  const mockedSparrowNodeData =
    sparrowData.successfulNodeDataSparrowDataResponse as NodeDetailViewModel;

  beforeEach(() => {
    dataProviderMock = {
      getGateway: jest.fn().mockResolvedValueOnce(mockedGatewaySparrowData),
      getGateways: jest.fn().mockResolvedValueOnce(mockedGatewaysSparrowData),
      getNode: jest.fn().mockResolvedValueOnce(mockedNodeSparrowData),
      getNodes: jest.fn().mockResolvedValueOnce(mockedNodesSparrowData),
      getNodeData: jest.fn().mockResolvedValueOnce(mockedSparrowNodeData),
    };
    appServiceMock = new AppService(dataProviderMock);
  });

  it("should return a single gateway when getGateway is called", async () => {
    const res = await appServiceMock.getGateway(mockedGatewayUID);
    expect(res).toEqual(mockedGatewaySparrowData);
  });

  it("should return a list of gateways when getGateways is called", async () => {
    const res = await appServiceMock.getGateways();
    expect(res).toEqual(mockedGatewaysSparrowData);
  });

  it("should return a single node when getNode is called", async () => {
    const res = await appServiceMock.getNode(mockedGatewayUID, mockedNodeId);
    expect(res).toEqual(mockedNodeSparrowData);
  });

  it("should return a list of nodes when getNodes is called", async () => {
    const res = await appServiceMock.getNodes([mockedGatewayUID]);
    expect(res).toEqual(mockedNodesSparrowData);
  });

  it("should return a list of node data when getNodeData is called", async () => {
    const res = await appServiceMock.getNodeData(
      mockedGatewayUID,
      mockedNodeId
    );
    expect(res).toEqual(mockedSparrowNodeData);
  });
});
