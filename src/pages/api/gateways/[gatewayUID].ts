// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import fetch from 'node-fetch';
import config from '../../../../config';

export default async function gatewaysHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    res.status(405).json({ err: 'Method not allowed' });
    return;
  }

  // Gateway UID must be a string
  if (typeof req.query.gatewayUID !== 'string') {
    res.status(400).json({ err: 'Invalid gateway UID parameter' });
    return;
  }

  // Query params
  const {gatewayUID} = req.query;
  // Notehub values
  const {baseURL, authToken, appUID} = config;
  // API path
  const endpoint = `${baseURL}/v1/projects/${appUID}/devices/${gatewayUID}`;
  // API headers
  const headers = new Headers({
    'Content-Type': 'application/json',
    'X-SESSION-TOKEN': authToken
  });

  // API call
  try {
    const response = await fetch(endpoint, { method: 'GET', headers });
    const responseJSON = await response.json();
    // Return JSON
    res.status(200).json(responseJSON);
  } catch (err) {
    // Return 500 error
    res.status(500).json({ err: 'Failed to fetch gateway data' });
  }
}
