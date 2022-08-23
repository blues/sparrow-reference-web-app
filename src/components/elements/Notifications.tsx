import { Alert, Button } from "antd";
import { NextRouter, useRouter } from "next/router";
import { fetchNotifications, presentNotifications as apiAppNotifications, removeNotification } from "../../api-client/notification";
import { services } from "../../services/ServiceLocatorClient";
import {
  AppNotification,
  NodePairedWithGatewayAppNotification,
  NodePairedWithGatewayAppNotificationType,
} from "../presentation/notifications";
import { useQuery } from "react-query";
import React from "react";

async function nodePairedAction(n: NodePairedWithGatewayAppNotification, router: NextRouter) {
  console.log("redirecting", n);
  try {
    await removeNotification(n.id);
  }
  catch (e) {
    console.log(e);
  }
  console.log("removed notification", n);

  const url = services()
    .getUrlManager()
    .nodeSettings(n.gateway.uid, n.node.nodeId);
  console.log("redirecting to", url);

  await router.push(url);
}

function renderNodePairedNotification(n: NodePairedWithGatewayAppNotification, router: NextRouter) {

  const note = <span>A new node was recently paired.</span>;
  //const details = <span>Node ID: <span>{n.node.nodeId}</span></span>
  const ref: React.Ref<HTMLElement> = React.createRef();
  return (
    <Alert key={n.id}
      banner
      message={note}
      type="info"
      closable
      onClose={async () => await removeNotification(n.id)}
      action={
        <Button ref={ref} type="primary" onClick={async () => await nodePairedAction(n, router)}>
          Setup
        </Button>
      }
    />
  );
}

interface NotificationProps {
  items: AppNotification[];
}

function renderNotification(notification: AppNotification, router: NextRouter) {
  if (notification.type === NodePairedWithGatewayAppNotificationType) {
    return renderNodePairedNotification(notification as NodePairedWithGatewayAppNotification, router);
  }
  return null;
}


const NotificationsComponent = (props: NotificationProps) => {
  const router = useRouter();
  const { data, status } = useQuery("notifications", apiAppNotifications, { refetchInterval: 5000 });
  return <> {
      status==="success" &&
      data?.notifications.map((notification) =>
        renderNotification(notification, router)
      ).filter(n => n)
  }</>;
};

export default NotificationsComponent;
