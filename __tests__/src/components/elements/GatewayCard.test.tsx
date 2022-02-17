/* eslint-disable react/jsx-props-no-spreading */
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/extend-expect";
import GatewayCard from "../../../../src/components/elements/GatewayCard";
import { GATEWAY_MESSAGE } from "../../../../src/components/constants/ui";

const mockGatewayData = {
  uid: "My Mocked Gatway",
  serialNumber: "67890",
  location: "Gainesville, FL",
  voltage: 3.7,
  lastActivity: "2022-01-05T07:36:55Z",
};

const mockedGatewayDataLongName = {
  uid: "Another Mocked Gateway",
  serialNumber:
    "My Mocked Gateway With an Unbelievably Long Serial Number, Seriously You'll be Amazed",
  location: "San Diego, CA",
  voltage: 4.0,
  lastActivity: "2022-02-11T08:48:01Z",
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
      screen.getByText(mockGatewayData.location, {
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

  it("should add an ellipsis and provide a tooltip when gateway data name is too long to fit on card", () => {
    render(
      <GatewayCard gatewayDetails={mockedGatewayDataLongName} index={index} />
    );
    userEvent.hover(
      screen.getByText(mockedGatewayDataLongName.serialNumber, { exact: false })
    );
    expect(
      screen.getByText(mockedGatewayDataLongName.serialNumber)
    ).toBeInTheDocument();
  });
});
