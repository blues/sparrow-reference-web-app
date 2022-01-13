/* eslint-disable react/jsx-props-no-spreading */
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import GatewayDetails from "../../../src/pages/[gatewayUID]/details";
import Gateway from "../../../src/models/Gateway";
import Sensor from "../../../src/models/Sensor";

const mockGateway: Gateway = {
  uid: "dev:123",
  serialNumber: "my-gateway",
  lastActivity: "2022-01-13T15:02:46Z",
  location: "someplace",
  voltage: 1.2,
};
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
    render(<GatewayDetails gateway={mockGateway} sensors={mockSensors} />);

    expect(
      screen.getByText(mockGateway.serialNumber, { exact: false })
    ).toBeInTheDocument();
    expect(
      screen.getByText(mockGateway.location || "", { exact: false })
    ).toBeInTheDocument();

    expect(
      screen.getByText(mockSensors[0].name || "", { exact: false })
    ).toBeInTheDocument();
    expect(
      screen.getByText(mockSensors[1].name || "", { exact: false })
    ).toBeInTheDocument();
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
