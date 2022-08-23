// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { HTTP_STATUS } from "../../constants/http";
import { services } from "../../services/ServiceLocatorServer";
import { Notification } from "../../services/NotificationsStore";

async function fetchNotifications() {
  return await services().getNotificationsStore().getNotifications();
}

function isNotification(o: any): o is Notification {
  return !!(o.content && o.id && o.type);
}

function invalidArgumentError() {
  return { err: HTTP_STATUS.INVALID_REQUEST };
}

function asNotification(o: object): Notification {
  if (isNotification(o)) return o as Notification;
  else throw invalidArgumentError();
}

function asNotifications(body: any): Notification[] {
  const { notifications } = body;
  if (Array.isArray(notifications)) {
    throw invalidArgumentError();
  }
  return notifications.map((item: any) => asNotification(item));
}

export default async function notificationsHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    switch (req.method) {
      case "GET": {
        const { present } = req.query;  // presentation mode
        const notifications = await (present ? services().getAppService().getAppNotifications() : fetchNotifications());
        res.status(200).json({ notifications });
      }
      case "POST": {
        const notifications = asNotifications(req.body);
        await services()
          .getNotificationsStore()
          .addNotifications(...notifications);
        res.status(201).json(notifications); // created
        break;
      }
      case "DELETE": {
        const id = req.query.id;
        const notificationIDs = typeof id === "string" ? [id] : id;
        await services()
          .getNotificationsStore()
          .removeNotifications(notificationIDs);
        res.status(200).json(notificationIDs);
        break;
      }
      default:
        // Other methods not allowed at this route
        res.status(405).json({ err: HTTP_STATUS.METHOD_NOT_ALLOWED });
    }
  } catch (e: any) {
    if (e.err === HTTP_STATUS.INVALID_REQUEST) {
      res.status(400).json(e);
    }
  }
}
