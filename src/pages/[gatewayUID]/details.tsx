import Link from "next/link";
import type { NextPage } from "next";
import Card from "../../components/elements/Card";
import styles from "../../styles/Home.module.scss";

const GatewayDetails: NextPage = () => {
  const sensorInfo = [
    {
      title: "Lobby",
      extra: <Link href="/12345/sensor/67890">Summary</Link>,
      contents: (
        <ul>
          <li>Temperature: 72° F</li>
          <li>Humidity: 23%</li>
          <li>Motion: inactive</li>
          <li>Battery: 36%</li>
          <li>Last active: 3 minutes ago</li>
        </ul>
      ),
    },
    {
      title: "Conference Room",
      extra: <Link href="/12345/sensor/67890/details">Summary</Link>,
      contents: (
        <ul>
          <li>Temperature: 68° F</li>
          <li>Humidity: 18%</li>
          <li>Motion: inactive</li>
          <li>Battery: 72%</li>
          <li>Last active: 38 seconds ago</li>
        </ul>
      ),
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
          {sensorInfo.map((sensor) => (
            <Card key={sensor.title} title={sensor.title} extra={sensor.extra}>
              {sensor.contents}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GatewayDetails;
