import Image from "next/image";
import React from "react";
import { Layout, Menu } from "antd";
import { GatewayOutlined } from "@ant-design/icons";
import styles from "../../styles/Sider.module.scss";

const { SubMenu } = Menu;

const SiderComponent = () => {
  const { Sider } = Layout;
  return (
    <Sider width={275} className={styles.sider}>
      <Menu
        onClick={() => {}}
        defaultSelectedKeys={["1"]}
        defaultOpenKeys={["gateways"]}
        mode="inline"
        className={styles.menu}
      >
        <SubMenu key="gateways" title="Gateways" icon={<GatewayOutlined />}>
          {/* TODO: Get these dynamically. How? Good question! */}
          <Menu.Item>tj-gateway</Menu.Item>
          <Menu.Item>paige-gateway</Menu.Item>
          <Menu.Item>zak-gateway</Menu.Item>
        </SubMenu>
        <Menu.Item key="otherLinks" disabled className={styles.otherLinks}>
          Other Links
        </Menu.Item>
        <Menu.Item key="notehubLink" className={styles.notehubLink}>
          {/* TODO: Link to the correct Notehub project */}
          <a
            href="https://notehub.io/"
            rel="noreferrer"
            target="_blank"
            className={styles.notehubLink}
          >
            <Image
              alt="Your Notehub project"
              src="/images/notehub_logo.png"
              height={60}
              width={160}
            />
            <Image
              alt=""
              height={16}
              width={16}
              src="/images/new-page.svg"
              className={styles.newPageIcon}
            />
          </a>
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default SiderComponent;
