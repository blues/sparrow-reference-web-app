/* eslint-disable react/jsx-props-no-spreading */
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import userEvent from "@testing-library/user-event";
import NodeCard from "../../../../src/components/elements/NodeCard";
// eslint-disable-next-line jest/no-mocks-import
import "../../../../__mocks__/matchMediaMock";
import { NODE_MESSSAGE, SENSOR_MESSAGE } from "../../../../src/constants/ui";

const mockNodeData = {
  name: "My Mocked Node",
  nodeId: "1234",
  humidity: 29,
  pressure: 1000,
  temperature: 24.5,
  voltage: 4.2,
  total: 40,
  count: 2,
  lastActivity: "2022-01-01T15:28:38Z",
  gatewayUID: "abcdef",
};

const mockedSensorDataLongName = {
  name: "My Extra Super Dee Duper Long Sensor Name",
  nodeId: "9101",
  humidity: 46,
  temperature: 29,
  voltage: 4.2,
  lastActivity: "2022-02-12T08:55:33Z",
  gatewayUID: "mnopqr",
};

const mockUndefinedSensorData = {
  nodeId: "5678",
  lastActivity: "2022-01-06T01:23:41Z",
  gatewayUID: "ghijkl",
};

const index = 1;

describe("Sensor details card component", () => {
  it("should render the card when node details data is supplied", () => {
    render(<NodeCard nodeDetails={mockNodeData} index={index} />);

    expect(screen.getByText(mockNodeData.name)).toBeInTheDocument();
    expect(
      screen.getByText(mockNodeData.humidity, { exact: false })
    ).toBeInTheDocument();
    expect(
      screen.getByText(mockNodeData.temperature, { exact: false })
    ).toBeInTheDocument();
    expect(
      screen.getByText(mockNodeData.voltage, { exact: false })
    ).toBeInTheDocument();
    expect(screen.getByText(mockNodeData.count)).toBeInTheDocument();
  });

  it("should render fallback messages when all node details are not supplied", () => {
    render(<NodeCard nodeDetails={mockUndefinedSensorData} index={index} />);
    expect(screen.getByText(NODE_MESSSAGE.NO_NAME)).toBeInTheDocument();
    expect(
      screen.getAllByText(SENSOR_MESSAGE.NO_HUMIDITY, { exact: false })[0]
    ).toBeInTheDocument();
    expect(
      screen.getAllByText(SENSOR_MESSAGE.NO_PRESSURE, { exact: false })[1]
    ).toBeInTheDocument();
    expect(
      screen.getAllByText(SENSOR_MESSAGE.NO_TEMPERATURE, { exact: false })[2]
    ).toBeInTheDocument();
    expect(
      screen.getAllByText(SENSOR_MESSAGE.NO_VOLTAGE, { exact: false })[3]
    ).toBeInTheDocument();
  });

  it("should add an ellipsis and provide a tooltip when card name is too long to fit on card", () => {
    render(<NodeCard nodeDetails={mockedSensorDataLongName} index={index} />);
    userEvent.hover(
      screen.getByText(mockedSensorDataLongName.name, { exact: false })
    );
    expect(screen.getByText(mockedSensorDataLongName.name)).toBeInTheDocument();
  });
});