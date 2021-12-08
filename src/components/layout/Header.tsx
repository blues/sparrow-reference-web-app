import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Layout } from "antd";
import Logo from "../../../public/images/sparrow_logo.svg";
import styles from "../../../styles/Header.module.scss";

const HeaderComponent = () => {
  const { Header } = Layout;
  return (
    <Header className={styles.header}>
      <Link href="/">
        <a>
          <Image src={Logo} height={70} width={100} alt="Sparrow Logo" />
        </a>
      </Link>
      <h4 className={styles.headerText}>Your Company Name Here</h4>
    </Header>
  );
};

export default HeaderComponent;
