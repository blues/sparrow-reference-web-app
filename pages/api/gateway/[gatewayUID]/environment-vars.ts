// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.status(200).json({
    "environment_variables": {
      "_tags": "rocks",
      "sensordb_reset_counts": "17"
    },
    "environment_variables_env_default": {
      "env_update_mins": "5",
      "pairing_timeout_mins": "60",
      "sensordb_reset_counts": "0",
      "sensordb_update_mins": "60"
    }
  });
}
