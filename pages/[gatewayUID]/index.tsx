import type { NextPage } from 'next';
import { useRouter } from 'next/router';

const GatewaySummary: NextPage = () => {
  const router = useRouter();
  const { gatewayUID } = router.query;

  return (
    <div>
      <h1>Gateway Summary</h1>
      <p>Gateway UID: {gatewayUID}</p>
    </div>
  );
};

export default GatewaySummary;