import type { NextPage } from 'next';
import { useRouter } from 'next/router';

const SensorDetails: NextPage = () => {
  const router = useRouter();
  const { gatewayUID, sensorUID } = router.query;

  return (
    <div>
      <h1>Sensor Details</h1>
      <p>Gateway UID: {gatewayUID}</p>
      <p>Sensor UID: {sensorUID}</p>
    </div>
  );
};

export default SensorDetails;