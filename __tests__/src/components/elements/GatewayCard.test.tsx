/* eslint-disable react/jsx-props-no-spreading */
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import GatewayCard from "../../../../src/components/elements/GatewayCard";
import { getFormattedLocation } from "../../../../src/components/presentation/uiHelpers";
import { GATEWAY_MESSAGE } from "../../../../src/constants/ui";

const mockGatewayData = {
  uid: "My Mocked Gatway",
  serialNumber: "67890",
  location: "Gainesville FL",
  voltage: 3.7,
  lastActivity: "2022-01-05T07:36:55Z",
};

const mockUndefinedGatewayData = {
  uid: "My Other Mocked Gatway",
  serialNumber: "13579",
  voltage: 2.8,
  lastActivity: "2022-01-07T09:12:00Z",
};

const index = 1;

describe("Gateway card component", () => {
  it("should render the card when gateway data is supplied", () => {
    render(<GatewayCard gatewayDetails={mockGatewayData} index={index} />);

    expect(screen.getByText(mockGatewayData.serialNumber)).toBeInTheDocument();
    expect(
      screen.getByText(getFormattedLocation(mockGatewayData.location), {
        exact: false,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByText(mockGatewayData.voltage, { exact: false })
    ).toBeInTheDocument();
  });

  it("should render the card when particular gateway data is missing", () => {
    render(
      <GatewayCard gatewayDetails={mockUndefinedGatewayData} index={index} />
    );

    expect(
      screen.getByText(mockUndefinedGatewayData.serialNumber)
    ).toBeInTheDocument();
    expect(
      screen.getByText(GATEWAY_MESSAGE.NO_LOCATION, { exact: false })
    ).toBeInTheDocument();
    expect(
      screen.getByText(mockUndefinedGatewayData.voltage, { exact: false })
    ).toBeInTheDocument();
  });
});
