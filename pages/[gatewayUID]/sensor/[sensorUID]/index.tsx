import type { NextPage } from 'next';
import { useRouter } from 'next/router';

const SensorSummary: NextPage = () => {
  const router = useRouter();
  const { gatewayUID, sensorUID } = router.query;

  return (
    <div>
      <h1>Sensor Summary</h1>
      <p>Gateway UID: {gatewayUID}</p>
      <p>Sensor UID: {sensorUID}</p>
    </div>
  );
};

export default SensorSummary;
