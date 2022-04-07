import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Layout } from "antd";
import Logo from "../../../public/images/sparrow_logo.svg";
import styles from "../../styles/Header.module.scss";

const HeaderComponent = () => {
  const { Header } = Layout;
  return (
    <Header className={styles.header}>
      <Link href="/">
        <a data-testid="logo">
          <Image src={Logo} width={100} alt="Sparrow Logo" />
        </a>
      </Link>
      <h2>powered by blues</h2>
    </Header>
  );
};

export default HeaderComponent;
