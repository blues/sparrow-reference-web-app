import { ReactNode } from "react";
import { Card } from "antd";
import styles from "../styles/Card.module.scss";

const CardComponent = function CardComponent({
  title,
  extra,
  children,
}: {
  title: string;
  extra: any;
  children: ReactNode;
}) {
  return (
    <Card className={styles.cardStyle} title={title} extra={extra}>
      {children}
    </Card>
  );
};

export default CardComponent;
