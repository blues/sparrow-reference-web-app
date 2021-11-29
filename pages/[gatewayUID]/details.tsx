import type { NextPage } from 'next';
import { useRouter } from 'next/router';

const GatewayDetails: NextPage = () => {
  const router = useRouter();
  const { gatewayUID } = router.query;

  return (
    <div>
      <h1>Gateway Details</h1>
      <p>Gateway UID: {gatewayUID}</p>
    </div>
  );
};

export default GatewayDetails;
