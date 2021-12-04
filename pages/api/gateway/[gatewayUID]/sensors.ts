// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    // Stubbed response for Latest Events API call
    // Oh dear, that's a lot of sensors. Maybe we just pick two?
    res.status(200).json({
      "latest_events": [
        {
          "file": "20323746323650020031002f#data.qo",
          "captured": "2021-09-28T18:19:32Z",
          "received": "2021-09-28T18:34:24Z",
          "event_uid": "b0dbdb9e-c453-4c88-b0a0-04aa4222cb55",
          "body": {
            "count": 18,
            "sensor": "0F Furnace [87JFH688+2H]"
          }
        },
        {
          "file": "203237463236500200320004#data.qo",
          "captured": "2021-09-28T18:10:14Z",
          "received": "2021-09-28T18:19:24Z",
          "event_uid": "36bfd135-ee62-490f-bf3d-a68ea030ac43",
          "body": {
            "count": 17,
            "sensor": "2F Center Guest Bath [87JFH688+2H]"
          }
        },
        {
          "file": "203237463236500200320044#data.qo",
          "captured": "2021-09-28T18:11:49Z",
          "received": "2021-09-28T18:19:24Z",
          "event_uid": "15228baf-2f53-4b1c-bed9-e79d6b985510",
          "body": {
            "count": 14,
            "sensor": "1F Dining Room [87JFH688+2H]"
          }
        },
        {
          "file": "203237463236500200360012#data.qo",
          "captured": "2021-09-28T18:10:38Z",
          "received": "2021-09-28T18:19:25Z",
          "event_uid": "38786bec-15ae-4ddb-98af-6109fd21cae7",
          "body": {
            "count": 17,
            "sensor": "1F Kitchen [87JFH688+2H]"
          }
        },
        {
          "file": "203237463236500200360044#data.qo",
          "captured": "2021-09-28T18:05:50Z",
          "received": "2021-09-28T18:19:25Z",
          "event_uid": "153ca03c-5431-42a2-b0b1-ec5fced220ba",
          "body": {
            "count": 16,
            "sensor": "2F Ray's Bath [87JFH688+2H]"
          }
        },
        {
          "file": "2032374632365002003c0031#data.qo",
          "captured": "2021-09-28T18:08:23Z",
          "received": "2021-09-28T18:19:26Z",
          "event_uid": "65c5b3c8-f418-42fc-944a-c03ce2fcc991",
          "body": {
            "count": 18,
            "sensor": "1F Great Hall Bath [87JFH688+2H]"
          }
        },
        {
          "file": "2032374632365002004c0037#data.qo",
          "captured": "2021-09-28T18:15:02Z",
          "received": "2021-09-28T18:19:26Z",
          "event_uid": "e7ba5cd9-5e0d-489e-b17e-bac6db538089",
          "body": {
            "count": 12,
            "sensor": "0F Freezer [87JFH688+2H]"
          }
        },
        {
          "file": "20323746323650050018000d#data.qo",
          "captured": "2021-10-11T11:57:07Z",
          "received": "2021-10-11T12:07:17Z",
          "event_uid": "9d9bd18d-83d1-452d-917d-94ddbd316a01",
          "body": {
            "count": 2,
            "sensor": "0F Freezer SPARROW [87JFH688+2H]"
          }
        },
        {
          "file": "2032374632365005001f000d#data.qo",
          "captured": "2021-09-28T18:37:00Z",
          "received": "2021-09-28T18:49:20Z",
          "event_uid": "14dfbede-a8fc-4dfc-8d65-079f80d5701d",
          "body": {
            "count": 19,
            "sensor": "2F Ray's Bath SPARROW [87JFH688+2H]"
          }
        },
        {
          "file": "20323746323650050028000a#air.qo",
          "captured": "2021-11-30T20:30:19Z",
          "received": "2021-11-30T20:30:45Z",
          "event_uid": "1961a1cd-6c10-4f70-a242-291838f4f125",
          "body": {
            "humidity": 27.234375,
            "pressure": 101152,
            "temperature": 22.6875,
            "voltage": 2.733
          }
        },
        {
          "file": "20323746323650050028000a#motion.qo",
          "captured": "2021-11-30T14:31:24Z",
          "received": "2021-11-30T14:31:42Z",
          "event_uid": "55cfc7d3-2987-43b9-9fb7-33173edb5949",
          "body": {
            "count": 1,
            "total": 281
          }
        },
        {
          "file": "20323746323650050029000b#air.qo",
          "captured": "2021-10-01T18:52:41Z",
          "received": "2021-10-01T19:07:13Z",
          "event_uid": "8fd30b3b-766a-4a90-9dbc-9e0a21ae73bf",
          "body": {
            "humidity": 38.15625,
            "pressure": 101950,
            "temperature": 24.265625
          }
        },
        {
          "file": "20323746323650050029000b#motion.qo",
          "captured": "2021-10-01T17:57:26Z",
          "received": "2021-10-01T18:07:12Z",
          "event_uid": "f3bbd770-40ee-4526-aeda-a560f069528a",
          "body": {
            "count": 3
          }
        },
        {
          "file": "20323746323650050034000c#air.qo",
          "captured": "2021-11-11T15:28:38Z",
          "received": "2021-11-11T15:30:51Z",
          "event_uid": "d85403ea-5763-46c9-8122-9146b9ec56c4",
          "body": {
            "humidity": 63.1875,
            "pressure": 102999,
            "temperature": 9.7734375,
            "voltage": 3.288
          }
        },
        {
          "file": "20323746323650050034000c#motion.qo",
          "captured": "2021-11-11T16:40:02Z",
          "received": "2021-11-11T16:40:34Z",
          "event_uid": "cfe54fd7-3b32-4173-8c4a-b84af08a6492",
          "body": {
            "count": 5,
            "total": 313
          }
        },
        {
          "file": "20323746323650070011001c#data.qo",
          "captured": "2021-09-28T18:08:29Z",
          "received": "2021-09-28T18:19:27Z",
          "event_uid": "099416f2-96ff-47ca-a0d6-c33fd24fbeb1",
          "body": {
            "count": 18,
            "sensor": "2F Laundry Room [87JFH688+2H]"
          }
        },
        {
          "file": "203237463236500700220022#data.qo",
          "captured": "2021-09-28T17:54:54Z",
          "received": "2021-09-28T18:04:25Z",
          "event_uid": "5a8b958b-dda6-41eb-8ae1-75beb4863725",
          "body": {
            "count": 18,
            "sensor": "3F Wrapping Room [87JFH688+2H]"
          }
        },
        {
          "file": "2032374632365007003e0043#data.qo",
          "captured": "2021-09-28T14:46:07Z",
          "received": "2021-09-28T14:49:26Z",
          "event_uid": "7c57ae17-9e47-4ec2-8e46-dcbab2604568",
          "body": {
            "count": 6,
            "sensor": "3f Theater [87JFH688+2H]"
          }
        },
        {
          "file": "_health.qo",
          "captured": "2021-11-19T21:30:40Z",
          "received": "2021-11-19T21:31:04Z",
          "event_uid": "dcaf8f7f-5053-496e-9f9c-7091a7b4a3e0",
          "body": {
            "text": "boot (brown-out & hard reset [13842])"
          }
        },
        {
          "file": "_session.qo",
          "captured": "2021-11-30T18:57:28Z",
          "received": "2021-11-30T18:57:28Z",
          "event_uid": "b6211d31-49b0-4a23-84ea-ed844ce59312",
          "body": {
            "why": "continuous connection mode (TLS)"
          }
        },
        {
          "file": "air.qo",
          "captured": "2021-04-29T17:00:33Z",
          "received": "2021-04-29T17:04:29Z",
          "event_uid": "3a3395f0-0875-4a56-bdf4-0ef4375a27ba",
          "body": {
            "humidity": 31.03125,
            "pressure": 100551,
            "temperature": 23.59375
          }
        },
        {
          "file": "data.qo",
          "captured": "2021-04-08T12:29:50Z",
          "received": "2021-04-08T12:29:48Z",
          "event_uid": "5f21fab4-6182-4ffd-8181-bb8c0974129d",
          "body": {
            "hi": "there"
          }
        },
        {
          "file": "motion.qo",
          "captured": "2021-04-30T01:12:39Z",
          "received": "2021-04-30T01:19:26Z",
          "event_uid": "8fce51b7-7fdd-4658-b465-70546f40a68a",
          "body": {
            "count": 1
          }
        },
        {
          "file": "sensors.db",
          "captured": "2021-11-30T20:30:40Z",
          "received": "2021-11-30T20:30:45Z",
          "event_uid": "658fda61-1da6-488b-b90a-302342c80565",
          "body": {
            "gateway_rssi": -95,
            "gateway_snr": -20,
            "lost": 6,
            "received": 11082,
            "sensor_ltp": -4,
            "sensor_rssi": -93,
            "sensor_snr": -6,
            "sensor_txp": 5,
            "voltage": 2.706,
            "when": 1638304237
          }
        }
      ]
    });
  } else {
    // Other methods not allowed at this route
    res.status(405).end();
  }
}
