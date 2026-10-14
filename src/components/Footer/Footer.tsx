import footerLogoImage from "../../assets/images/footer/konikMaly24x24Squoosh.png";
import footerLogoText from "../../assets/images/footer/3KLogo.png";
import styles from "./Footer.module.scss";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerLogoContainer}>
        <div className={styles.footerLogo}>
          <img src={footerLogoImage} alt="" width="24" />
          <img src={footerLogoText} alt="3K NexGen" />
        </div>
        <address>
          <a
            className={styles.footerLinkStyle}
            href="mailto:3k.nexgen@gmail.com"
          >
            3K.nexgen@gmail.com
          </a>
        </address>
      </div>

      <div className={styles.footerLegal}>
        <p className={styles.footerCopyrightText}>
          © {new Date().getFullYear()} Api Test
        </p>
      </div>
    </footer>
  );
}
