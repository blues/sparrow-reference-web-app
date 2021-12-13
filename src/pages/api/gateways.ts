// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {  
    // Stubbed response for Device API call
    res.status(200).json({
      "uid": "dev:000000000000000",
      "serial_number": "sparrow-demo-gateway",
      "provisioned": "2021-04-04T17:47:13Z",
      "last_activity": "2021-11-30T18:31:07Z",
      "contact": null,
      "product_uid": "product:com.blues.blues:sparrow",
      "fleet_uids": [
        "fleet:385cb94e-75f9-4dbb-8019-c738aa4ea06a"
      ],
      "tower_info": {
        "mcc": 310,
        "mnc": 410,
        "lac": 1045,
        "cell_id": 16142600
      },
      "tower_location": {
        "when": "2021-11-29T21:51:47Z",
        "name": "Salem MA",
        "country": "US",
        "timezone": "America/New_York",
        "latitude": 42.511987500000004,
        "longitude": -70.910546875
      },
      "gps_location": null,
      "triangulated_location": null,
      "voltage": 4.851,
      "temperature": 34.25
    });
  } else {
    // Other methods not allowed at this route
    res.status(405).end();
  }
}
