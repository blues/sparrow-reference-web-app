import Gateway from "../../../src/components/models/Gateway";
import Node from "../../../src/components/models/Node";
import NodeDetailViewModel from "../../../src/models/NodeDetailViewModel";
import AppService from "../../../src/services/AppService";
import { DataProvider } from "../../../src/services/DataProvider";
import sparrowData from "./__serviceMocks__/sparrowData.json";

describe("App Service", () => {
  let dataProviderMock: DataProvider;
  let appServiceMock: AppService;

  const { mockedGatewayUID, mockedSensorUID } = sparrowData;

  const mockedGatewaySparrowData =
    sparrowData.successfulGatewaySparrowDataResponse as Gateway;

  const mockedGatewaysSparrowData = [
    sparrowData.successfulGatewaySparrowDataResponse as Gateway,
  ];

  const mockedSensorSparrowData =
    sparrowData.successfulSensorSparrowDataResponse as Node[];

  const mockedSensorsSparrowData = [
    sparrowData.successfulSensorSparrowDataResponse as Node[],
  ];

  const mockedSensorDataSparrowData =
    sparrowData.successfulSensorDataSparrowDataResponse as NodeDetailViewModel;

  beforeEach(() => {
    dataProviderMock = {
      getGateway: jest.fn().mockResolvedValueOnce(mockedGatewaySparrowData),
      getGateways: jest.fn().mockResolvedValueOnce(mockedGatewaysSparrowData),
      getNode: jest.fn().mockResolvedValueOnce(mockedSensorSparrowData),
      getNodes: jest.fn().mockResolvedValueOnce(mockedSensorsSparrowData),
      getNodeData: jest.fn().mockResolvedValueOnce(mockedSensorDataSparrowData),
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

  it("should return a single sensor when getSensor is called", async () => {
    const res = await appServiceMock.getNode(mockedGatewayUID, mockedSensorUID);
    expect(res).toEqual(mockedSensorSparrowData);
  });

  it("should return a list of nodes when getNodes is called", async () => {
    const res = await appServiceMock.getNodes([mockedGatewayUID]);
    expect(res).toEqual(mockedSensorsSparrowData);
  });

  it("should return a list of node data when getNodeData is called", async () => {
    const res = await appServiceMock.getNodeData(
      mockedGatewayUID,
      mockedSensorUID
    );
    expect(res).toEqual(mockedSensorDataSparrowData);
  });
});
