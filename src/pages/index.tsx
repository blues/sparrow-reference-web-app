import React from "react";
import { GetServerSideProps, NextPage } from "next";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import Card from "../components/elements/Card";
import getGateways from "../lib/gateways";
import getSensors from "../lib/sensors";
import Gateway from "../models/Gateway";
import Sensor from "../models/Sensor";
import styles from "../styles/Home.module.scss";

type HomeData = {
  gateways: Gateway[];
  sensors: Sensor[];
};

const Home: NextPage<HomeData> = (data) => {
  const { gateways, sensors } = data;

  return (
    <div className={styles.container}>
      <h2>Gateways</h2>
      <div className={styles.groupedCards}>
        {gateways.map((gateway) => (
          <Card
            key={gateway.uid}
            title={gateway.serialNumber}
            extra={<Link href={`/${gateway.uid}/details`}>Details</Link>}
          >
            <ul>
              <li>Location: {gateway.location}</li>
              <li>
                Last seen:
                {formatDistanceToNow(new Date(gateway.lastActivity), {
                  addSuffix: true,
                })}
              </li>
              <li>Voltage: {gateway.voltage} V</li>
            </ul>
          </Card>
        ))}
      </div>

      <h2>Sensors</h2>
      <div className={styles.groupedCards}>
        {sensors.map((sensor) => (
          <Card
            key={sensor.macAddress}
            title={sensor.name}
            extra={
              <Link
                href={`/${sensor.gatewayUID}/sensor/${sensor.macAddress}/details`}
              >
                Details
              </Link>
            }
          >
            <ul>
              <li>Humidity: {sensor.humidity}</li>
              <li>Pressure: {sensor.pressure}</li>
              <li>Temperature: {sensor.temperature}</li>
              <li>Voltage: {sensor.voltage}</li>
              <li>
                Last seen:
                {formatDistanceToNow(new Date(sensor.lastActivity), {
                  addSuffix: true,
                })}
              </li>
            </ul>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps<HomeData> = async () => {
  const gateways = await getGateways();
  const sensors = getSensors();

  return {
    props: { gateways, sensors },
  };
};
