// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    // Stubbed response for Latest Events API call
    res.status(200).json({
      "latest_events": [
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
            "temperature": 24.265625,
            "voltage": 2.725
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
        }
      ]
    });
  } else {
    // Other methods not allowed at this route
    res.status(405).end();
  }
}
