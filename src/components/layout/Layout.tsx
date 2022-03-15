import { ReactNode } from "react";
import { Layout } from "antd";
import Header from "./Header";
import Footer from "./Footer";
import styles from "../../styles/Layout.module.scss";
import { LoadingMessage } from "./LoadingMessage";

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
      <Content className={styles.mainContent}>{children}</Content>
      <LoadingMessage isLoading={isLoading} />
      <Footer />
    </Layout>
  );
};

export default LayoutComponent;
