// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { HTTP_STATUS } from "../../../constants/http";

export default async function datastoreIngestionHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "POST":
      console.log(req.body);
      res.status(200).json({});
      break;
    default:
      console.log("BAD METHOD");
      // Other methods not allowed at this route
      res.status(405).json({ err: HTTP_STATUS.METHOD_NOT_ALLOWED });
  }
}