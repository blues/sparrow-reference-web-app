import { ReactNode } from "react";
import { Card } from "antd";
import styles from "../../styles/Card.module.scss";

const CardComponent = ({
  title,
  extra,
  children,
}: {
  title: string;
  extra?: JSX.Element;
  children: ReactNode;
}) => (
  <Card className={styles.cardStyle} title={title} extra={extra}>
    {children}
  </Card>
);

CardComponent.defaultProps = {
  extra: undefined,
};

export default CardComponent;
