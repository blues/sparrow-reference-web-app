import { Layout, Col } from "antd";
import Config from "../../../config";
import styles from "../../styles/Footer.module.scss";

const FooterComponent = () => {
  const { Footer } = Layout;
  return (
    <div className={styles.footerWrapper}>
      <hr className={styles.footerDivider} />
      <Footer className={styles.footer}>
        <div>
          Cloud-connected by{` `}
          <span>
            <a
              target="_blank"
              href="https://blues.com/products"
              rel="noreferrer"
              data-testid="notecard-link"
            >
              Notecard
            </a>
          </span>
        </div>
        <div>
          <details>
            <summary style={{ listStyle: "none", cursor: "pointer" }}>
              About
            </summary>
            {Config.isBuildVersionSet() ? Config.buildVersion : <></>}
          </details>
        </div>
        <div>
          Developed by{` `}
          <span>
            <a
              target="_blank"
              href="https://blues.com"
              rel="noreferrer"
              data-testid="blues-link"
            >
              Blues Inc.
            </a>
          </span>
        </div>
      </Footer>
    </div>
  );
};

export default FooterComponent;
