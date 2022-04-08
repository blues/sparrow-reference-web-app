import { GatewayOutlined } from "@ant-design/icons";
import { Layout, Menu } from "antd";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext } from "react";
import AppContext from "../AppContext";
import styles from "../../styles/Sider.module.scss";

const { SubMenu } = Menu;

const SiderComponent = () => {
  const { Sider } = Layout;
  const { gateways } = useContext(AppContext);
  const Router = useRouter();

  let selectedKeys = [""];
  gateways.forEach((gateway) => {
    if (Router.asPath === `/${gateway.uid}/details`) {
      selectedKeys = [gateway.uid];
    }
  });

  return (
    <Sider width={275} className={styles.sider}>
      <Menu
        selectedKeys={selectedKeys}
        openKeys={["gateways"]}
        mode="inline"
        className={styles.menu}
      >
        <SubMenu key="gateways" title="Gateways" icon={<GatewayOutlined />}>
          {gateways.map((gateway) => (
            <Menu.Item key={gateway.uid}>
              <Link href={`/${gateway.uid}/details`}>{gateway.name}</Link>
            </Menu.Item>
          ))}
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
