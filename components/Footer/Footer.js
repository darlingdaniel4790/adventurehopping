import { Typography } from "@mui/material";
import styles from "./Footer.module.css";
const Footer = (props) => {
  return <div className={styles.footerContainer}>{props.children}</div>;
};

export default Footer;
