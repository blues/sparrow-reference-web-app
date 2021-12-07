import Link from "next/link";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import Card from "../../components/Card";
import styles from "../../styles/Home.module.scss";

const GatewayDetails: NextPage = () => {
  const router = useRouter();
  const { gatewayUID } = router.query;

  const sensorInfo = [
    {
      title: "Lobby",
      extra: <Link href="/12345/sensor/67890">Summary</Link>,
      contents: (
        <>
          <li>Temperature: 72° F</li>
          <li>Humidity: 23%</li>
          <li>Motion: inactive</li>
          <li>Battery: 36%</li>
          <li>Last active: 3 minutes ago</li>
        </>
      ),
    },
    {
      title: "Conference Room",
      extra: <Link href="/12345/sensor/67890/details">Summary</Link>,
      contents: (
        <>
          <li>Temperature: 68° F</li>
          <li>Humidity: 18%</li>
          <li>Motion: inactive</li>
          <li>Battery: 72%</li>
          <li>Last active: 38 seconds ago</li>
        </>
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
