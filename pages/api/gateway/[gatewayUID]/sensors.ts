// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
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
      }
    ]
  });
}
