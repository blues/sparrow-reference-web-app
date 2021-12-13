// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case 'PUT':
      // Stubbed response for SET Environment Variable API call
      res.status(200).json({
        "environment_variables": {
          "_tags": "",
          "device_humidity": "55.9",
          "device_temp": "79.0"
        }
      });
      break;
    case 'DELETE':
      // Stubbed response for DELETE Environment Variable API call
      res.status(200).json({
        "environment_variables": {
          "_tags": "",
          "device_humidity": "55.9",
          "device_temp": "79.0"
        }
      });
      break;
    case 'GET':
      // Stubbed response for GET Environment Variable API call
      res.status(200).json({
        "environment_variables": {
          "_tags": "",
          "device_humidity": "55.9",
          "device_temp": "79.0"
        },
        "environment_variables_env_default": {
          "env_update_mins": "5",
          "pairing_timeout_mins": "60",
          "sensordb_reset_counts": "0",
          "sensordb_update_mins": "60"
        }
      });
      break;
    default:
      // Other methods not allowed at this route
      res.status(405).end();
      break;
  }
}
