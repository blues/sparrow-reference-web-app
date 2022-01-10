/* eslint-disable react/jsx-props-no-spreading */
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import GatewayCardComponent from "../../../src/components/elements/GatewayCard";

const mockGatewayData = {
  uid: "My Mocked Gatway",
  serialNumber: "67890",
  location: "Dining Room",
  voltage: 3.7,
  lastActivity: "2022-01-05T07:36:55Z",
};

describe("Gateway card component", () => {
  it("should render the card when gateway data is supplied", () => {
    render(<GatewayCardComponent {...mockGatewayData} />);

    expect(screen.getByText(mockGatewayData.serialNumber)).toBeInTheDocument();
    expect(
      screen.getByText(mockGatewayData.location, { exact: false })
    ).toBeInTheDocument();
    expect(
      screen.getByText(mockGatewayData.voltage, { exact: false })
    ).toBeInTheDocument();
  });
});
