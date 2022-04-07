import { ReactNode } from "react";
import { Layout } from "antd";
import Footer from "./Footer";
import Header from "./Header";
import { LoadingSpinner } from "./LoadingSpinner";
import Sider from "./Sider";
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
      <Header />
      <Layout>
        <Sider />
        <Content className={styles.mainContent}>
          <LoadingSpinner isLoading={isLoading}>{children}</LoadingSpinner>
        </Content>
      </Layout>
      <Footer />
    </Layout>
  );
};

export default LayoutComponent;
