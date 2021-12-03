import Link from "next/link";
import { NextPage } from "next";
import Card from "../components/Card";
import styles from "../styles/Home.module.scss";

const Home: NextPage = function Home() {
  const gatewayInfo = [
    {
      title: "Gateway Summary Page",
      extra: <Link href="/12345">Summary</Link>,
      contents: (
        <li>
          <Link href="/12345">Gateway 12345 Summary Page</Link>
        </li>
      ),
    },
  ];
  const sensorInfo = [
    {
      title: "Sensor Summary Page",
      extra: <Link href="/12345">Summary</Link>,
      contents: (
        <li>
          <Link href="/12345/sensor/67890">Sensor 67890 Details Page</Link>
        </li>
      ),
    },
    {
      title: "Sensor Details Page",
      extra: <Link href="/12345/sensor/67890">Summary</Link>,
      contents: (
        <li>
          <Link href="/12345/sensor/67890">Sensor 67890 Details Page</Link>
        </li>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <h2>Gateways</h2>
      <div className={styles.groupedCards}>
        {gatewayInfo.map((gateway) => (
          <Card key={gateway.title} title={gateway.title} extra={gateway.extra}>
            {gateway.contents}
          </Card>
        ))}
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
  );
};

export default Home;
