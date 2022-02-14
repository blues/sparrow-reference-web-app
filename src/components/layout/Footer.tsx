import { Layout } from "antd";
import Config from "../../../config";
import styles from "../../styles/Footer.module.scss";

const FooterComponent = () => {
  const { Footer } = Layout;
  return (
    <div className={styles.footerWrapper}>
      <hr className={styles.footerDivider} />
      <Footer className={styles.footer}>
        <div>
          Cloud-connected by&nbsp;
          <a
            target="_blank"
            href="https://blues.io/products"
            rel="noreferrer"
            data-testid="notecard-link"
          >
            Notecard
          </a>
        </div>
        <div>
          <details>
            <summary style={{ listStyle: "none", cursor: "pointer" }}>
              About
            </summary>
            {Config.buildVersion !== "ver n/a" ? Config.buildVersion : null}
          </details>
        </div>
        <div>
          Developed by&nbsp;
          <a
            target="_blank"
            href="https://blues.io"
            rel="noreferrer"
            data-testid="blues-link"
          >
            Blues Inc.
          </a>
        </div>
      </Footer>
    </div>
  );
};

export default FooterComponent;
