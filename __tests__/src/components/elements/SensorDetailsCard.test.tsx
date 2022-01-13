/* eslint-disable react/jsx-props-no-spreading */
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import SensorDetailsCardComponent from "../../../../src/components/elements/SensorDetailsCard";
import { SENSOR_MESSAGE } from "../../../../src/constants/ui";

const mockSensorData = {
  name: "My Mocked Sensor",
  macAddress: "1234",
  humidity: 29,
  pressure: 1000,
  temperature: 24.5,
  voltage: 4.2,
  lastActivity: "2022-01-01T15:28:38Z",
  gatewayUID: "abcdef",
};

const mockUndefinedSensorData = {
  macAddress: "5678",
  lastActivity: "2022-01-06T01:23:41Z",
  gatewayUID: "ghijkl",
};

describe("Sensor details card component", () => {
  it("should render the card when sensor details data is supplied", () => {
    render(<SensorDetailsCardComponent {...mockSensorData} />);

    expect(screen.getByText(mockSensorData.name)).toBeInTheDocument();
    expect(
      screen.getByText(mockSensorData.humidity, { exact: false })
    ).toBeInTheDocument();
    expect(
      screen.getByText(mockSensorData.temperature, { exact: false })
    ).toBeInTheDocument();
    expect(
      screen.getByText(mockSensorData.voltage, { exact: false })
    ).toBeInTheDocument();
  });

  it("should render fallback messages when all sensor details are not supplied", () => {
    render(<SensorDetailsCardComponent {...mockUndefinedSensorData} />);
    expect(screen.getByText(SENSOR_MESSAGE.NO_NAME)).toBeInTheDocument();
    expect(
      screen.getByText(SENSOR_MESSAGE.NO_HUMIDITY, { exact: false })
    ).toBeInTheDocument();
    expect(
      screen.getByText(SENSOR_MESSAGE.NO_PRESSURE, { exact: false })
    ).toBeInTheDocument();
    expect(
      screen.getByText(SENSOR_MESSAGE.NO_TEMPERATURE, { exact: false })
    ).toBeInTheDocument();
    expect(
      screen.getByText(SENSOR_MESSAGE.NO_VOLTAGE, { exact: false })
    ).toBeInTheDocument();
  });
});
