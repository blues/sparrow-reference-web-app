import { Layout } from "antd";
import styles from "../styles/Footer.module.scss";

const Sidebar = function SidebarComponent() {
  const { Footer } = Layout;
  return (
    <>
      <hr className={styles.footerDivider} />
      <Footer className={styles.footer}>
        <div>
          Cloud-connected by <br />
          <a target="_blank" href="https://blues.io/products" rel="noreferrer">
            Notecard
          </a>
        </div>
        <div>
          Developed by <br />
          <a target="_blank" href="https://blues.io" rel="noreferrer">
            Blues Inc.
          </a>
        </div>
      </Footer>
    </>
  );
};

export default Sidebar;
