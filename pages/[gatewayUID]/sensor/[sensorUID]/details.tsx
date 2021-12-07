import React, { useState } from 'react';
import { Form, Input, Button, Radio } from 'antd';
import { Tabs } from 'antd';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import VoltageChart from '../../../../components/charts/VoltageChart';
import styles from '../../../../styles/Form.module.scss';

const SensorDetails: NextPage = () => {
  const router = useRouter();
  const { gatewayUID, sensorUID } = router.query;
  const [form] = Form.useForm();
  const { TabPane } = Tabs;

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

  function callback(key) {
    console.log(key);
  }

  return (
    <div>
      <h1>Conference Room</h1>

      <Tabs defaultActiveKey="1" onChange={callback}>
        <TabPane tab="Summary" key="1">
          <h2>Current Readings</h2>

          <h3>Voltage</h3>
          <div style={{ width: '900px' }}>
            <VoltageChart data={mockVoltageData} />
          </div>
        </TabPane>
        <TabPane tab="Device Details" key="2">
          <Form
          form={form}
          layout="vertical"
          >
            <Form.Item label="Last Updated" className={styles.formLabel}>
              <div className={styles.formData}>13 minutes ago</div>
            </Form.Item>
            <Form.Item label="Name" tooltip="What is the name of your sensor?" className={styles.formLabel}>
              <Input placeholder="Name of sensor" />
            </Form.Item>
            <Form.Item
              label="Location" tooltip="Where is your sensor located?" className={styles.formLabel}>
              <Input placeholder="Sensor location" />
            </Form.Item>
            <Form.Item label="Gateway" className={styles.formLabel}>
              <div className={styles.formData}>2nd Floor Gateway</div>
            </Form.Item>
            <Form.Item>
              <Button type="primary">Save</Button>
            </Form.Item>
          </Form>
        </TabPane>
      </Tabs>

    </div>
  );
};

export default SensorDetails;
