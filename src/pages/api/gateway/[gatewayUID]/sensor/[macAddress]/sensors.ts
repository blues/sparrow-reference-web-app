// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "POST":
      // Stubbed response for note.update success (empty JSON object)
      res.status(200).json({});
      break;
    case "GET":
      // Stubbed response for note.get for sensor config.db
      res.status(200).json({
        when: 1638304240,
        note: "20323746323650050028000a",
        body: {
          // not sure what these values are for so commenting out for now
          // gateway_rssi: -95,
          // gateway_snr: -20,
          // lost: 6,
          // received: 11082,
          // sensor_ltp: -4,
          // sensor_rssi: -93,
          // sensor_snr: -6,
          // sensor_txp: 5,
          // when: 1638304237,
          voltage: 2.706,
        },
      });
      break;
    default:
      // Other methods not allowed at this route
      res.status(405).end();
      break;
  }
}
