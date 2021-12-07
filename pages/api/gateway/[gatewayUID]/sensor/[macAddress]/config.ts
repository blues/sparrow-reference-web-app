// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case 'POST':
      // Stubbed response for note.update success (empty JSON object)
      res.status(200).json({});
      break;
    case 'GET':
      // Stubbed response for note.get for sensor config.db
      res.status(200).json({
        "note": "20323746323650020031002f",
        "body": {
          "loc": "87JFH688+2H",
          "name": "0F Furnace"
        },
        "time": 1632763519
      });
      break;
    default:
      // Other methods not allowed at this route
      res.status(405).end();
      break;
  }
}
