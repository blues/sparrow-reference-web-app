// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.status(200).json({
    "note": "20323746323650020031002f",
    "body": {
      "loc": "87JFH688+2H",
      "name": "0F Furnace"
    },
    "time": 1632763519
  });
}
