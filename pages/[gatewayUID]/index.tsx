import type { NextPage } from 'next';
import { useRouter } from 'next/router';

import VoltageChart from '../../components/charts/VoltageChart';

// Using hardcoded voltage data temporarily
const mockVoltageData = [
  {
    when: new Date('2021-11-19T18:46:09Z'),
    value: 2.835,
  },
  {
    when: new Date('2021-11-19T17:43:09Z'),
    value: 2.907,
  },
  {
    when: new Date('2021-11-19T17:06:22Z'),
    value: 2.849,
  },
  {
    when: new Date('2021-11-19T15:42:19Z'),
    value: 2.886,
  },
  {
    when: new Date('2021-11-19T14:42:00Z'),
    value: 2.921,
  },
  {
    when: new Date('2021-11-19T13:40:25Z'),
    value: 2.943,
  },
  {
    when: new Date('2021-11-19T12:40:28Z'),
    value: 2.958,
  },
  {
    when: new Date('2021-11-19T11:40:29Z'),
    value: 2.931,
  },
  {
    when: new Date('2021-11-19T09:41:09Z'),
    value: 2.895,
  },
  {
    when: new Date('2021-11-19T08:41:09Z'),
    value: 2.928,
  },
  {
    when: new Date('2021-11-19T07:40:29Z'),
    value: 2.921,
  },
  {
    when: new Date('2021-11-19T05:41:50Z'),
    value: 2.901,
  },
  {
    when: new Date('2021-11-19T03:41:51Z'),
    value: 2.931,
  },
  {
    when: new Date('2021-11-19T02:40:30Z'),
    value: 2.925,
  },
  {
    when: new Date('2021-11-19T01:40:31Z'),
    value: 2.925,
  },
  {
    when: new Date('2021-11-19T00:40:31Z'),
    value: 2.91,
  },
  {
    when: new Date('2021-11-18T22:39:29Z'),
    value: 3.6989999999999994,
  },
].reverse();

const GatewaySummary: NextPage = () => {
  const router = useRouter();
  const { gatewayUID } = router.query;

  return (
    <div>
      <h1>Gateway Summary</h1>
      <p>Gateway UID: {gatewayUID}</p>

      <div style={{ width: '500px' }}>
        <VoltageChart data={mockVoltageData} />
      </div>
    </div>
  );
};

export default GatewaySummary;
