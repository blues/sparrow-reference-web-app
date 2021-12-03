import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Layout } from "antd";
import Logo from "../public/images/sparrow_logo.svg";
import styles from "../styles/Header.module.scss";

const HeaderComponent = function HeaderComponent() {
  const { Header } = Layout;
  return (
    <Header className={styles.header}>
      <Link href="/">
        <a>
          <Image src={Logo} height={50} width={50} alt="Sparrow Logo" />
        </a>
      </Link>
      <h1 className={styles.headerText}>Your Company Name Here</h1>
    </Header>
  );
};

export default HeaderComponent;
