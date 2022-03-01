import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/extend-expect";
// eslint-disable-next-line jest/no-mocks-import
import "../../../../__mocks__/matchMediaMock";
import GatewayCard from "../../../../src/components/elements/GatewayCard";
import { GATEWAY_MESSAGE } from "../../../../src/constants/ui";

const mockGatewayData = {
  uid: "My Mocked Gateway",
  serialNumber: "67890",
  location: "Gainesville, FL",
  voltage: 3.7,
  lastActivity: "2022-01-05T07:36:55Z",
  nodeList: [
    {
      name: "My First Mocked Sensor",
      nodeId: "1011",
      humidity: 29,
      pressure: 1000,
      temperature: 24.5,
      voltage: 4.2,
      total: 40,
      count: 2,
      lastActivity: "2022-01-07T15:28:38Z",
      gatewayUID: "My Mocked Gateway",
    },
  ],
};

const mockedGatewayDataLongName = {
  uid: "Another Mocked Gateway",
  serialNumber:
    "My Mocked Gateway With an Unbelievably Long Serial Number, Seriously You'll be Amazed",
  location: "San Diego, CA",
  voltage: 4.0,
  lastActivity: "2022-02-11T08:48:01Z",
  nodeList: [],
};

const mockUndefinedGatewayData = {
  uid: "My Other Mocked Gateway",
  serialNumber: "13579",
  voltage: 2.8,
  lastActivity: "2022-01-07T09:12:00Z",
  nodeList: [],
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
