import type { NextPage } from "next";
import SensorDetailsCard from "../../components/elements/SensorDetailsCard";
import styles from "../../styles/Home.module.scss";

const GatewayDetails: NextPage = () => {
  // placeholder data until real connection to Notehub data is established
  const mockedSensorDetails = [
    {
      macAddress: "20323746323650050028000a",
      gatewayUID: "dev:868050040065365",
      name: "TEST_NAME",
      voltage: 2.733,
      lastActivity: "2021-11-30T20:30:19Z",
      humidity: 27.234375,
      pressure: 101152,
      temperature: 22.6875,
    },
    {
      macAddress: "20323746323650050029000b",
      gatewayUID: "dev:868050040065365",
      name: "No sensor name currently set.",
      lastActivity: "2021-10-01T18:52:41Z",
      humidity: 38.15625,
      pressure: 101950,
      temperature: 24.265625,
    },
    {
      macAddress: "20323746323650050034000c",
      gatewayUID: "dev:868050040065365",
      name: "Garage Sensor",
      voltage: 3.288,
      lastActivity: "2021-11-11T15:28:38Z",
      humidity: 63.1875,
      pressure: 102999,
      temperature: 9.7734375,
    },
  ];

  return (
    <div>
      <h1>Gateway Details</h1>
      <div className={styles.container}>
        <h2>Gateway</h2>
        <div>
          <span>Device Name: 2nd Floor Gateway</span>
          <br />
          <span>Location: Anytown, USA</span>
          <br />
          <span>Last Seen: 16 seconds ago</span>
        </div>

        <h2>Sensors</h2>
        <div className={styles.groupedCards}>
          {mockedSensorDetails.map((sensor) => (
            <SensorDetailsCard key={sensor.macAddress} {...sensor} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default GatewayDetails;
