/* eslint-disable react/jsx-props-no-spreading */
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
// eslint-disable-next-line jest/no-mocks-import
import "../../../__mocks__/matchMediaMock"; // needed to avoid error due to JSDOM not implemetning method yet: https://jestjs.io/docs/manual-mocks#mocking-methods-which-are-not-implemented-in-jsdom
import GatewayDetails from "../../../src/pages/[gatewayUID]/details";
import Gateway from "../../../src/components/models/Gateway";
import Sensor from "../../../src/components/models/Sensor";
import { GATEWAY_MESSAGE } from "../../../src/constants/ui";

function getMockGateway(): Gateway {
  return {
    uid: "dev:123",
    serialNumber: "my-gateway",
    lastActivity: "2022-01-13T15:02:46Z",
    location: "someplace",
    voltage: 1.2,
  };
}

const mockSensors: Sensor[] = [
  {
    gatewayUID: "dev:123",
    lastActivity: "2022-01-13T15:02:46Z",
    macAddress: "20323746323650050028000a",
    humidity: 11,
    name: "my-sensor",
    pressure: 22,
    temperature: 33,
    voltage: 4.4,
  },
  {
    gatewayUID: "dev:123",
    lastActivity: "2022-01-13T15:02:46Z",
    macAddress: "20323746323650050028000b",
    humidity: 11,
    name: "another-sensor",
    pressure: 22,
    temperature: 33,
    voltage: 4.4,
  },
];

describe("Gateway details page", () => {
  it("should render the gateway and sensor information when a gateway is present", () => {
    const gateway = getMockGateway();
    render(<GatewayDetails gateway={gateway} sensors={mockSensors} />);

    expect(
      screen.getByText(gateway.serialNumber, { exact: false })
    ).toBeInTheDocument();

    expect(
      screen.getByText(mockSensors[0].name || "", { exact: false })
    ).toBeInTheDocument();
    expect(
      screen.getByText(mockSensors[1].name || "", { exact: false })
    ).toBeInTheDocument();
  });

  it("should render a gateway location if one is present", () => {
    const gateway = getMockGateway();
    gateway.location = "Michigan";

    render(<GatewayDetails gateway={gateway} sensors={mockSensors} />);
    expect(screen.getByText("Location", { exact: false })).toBeInTheDocument();
  });

  it("should not render a gateway location if one is not present", () => {
    const gateway = getMockGateway();
    delete gateway.location;
    render(<GatewayDetails gateway={gateway} sensors={mockSensors} />);
    expect(screen.queryByText(GATEWAY_MESSAGE.NO_LOCATION)).toBeInTheDocument();
  });

  it("should render an error when present", () => {
    const errorMessage = "FAILURE!";
    render(<GatewayDetails gateway={null} sensors={[]} err={errorMessage} />);

    expect(
      screen.getByText(errorMessage, { exact: false })
    ).toBeInTheDocument();
    expect(
      screen.queryByText("Gateway", { exact: false })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText("Sensor", { exact: false })
    ).not.toBeInTheDocument();
  });
});
