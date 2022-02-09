import { ReactNode } from "react";
import { Layout } from "antd";
import Header from "./Header";
import Footer from "./Footer";
import styles from "../../styles/Layout.module.scss";

const LayoutComponent = ({
  children,
  isLoading,
}: {
  children: ReactNode;
  isLoading: boolean;
}) => {
  const { Content } = Layout;
  return (
    <Layout>
      <Header isLoading={isLoading} />
      <Content className={styles.mainContent}>{children}</Content>
      <Footer />
    </Layout>
  );
};

export default LayoutComponent;
