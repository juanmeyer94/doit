import styles from "../styles/Logo.module.css"
import { ArchivoBlack } from "@/app/fonts/fonts"

export default function Logo() {
  return (
    <div className={styles.logoContainer}>
      <div className={styles.logo}>
      <span className={`${styles.letterD} ${ArchivoBlack.className}`}>I</span>
      <span className={`${styles.letterT} ${ArchivoBlack.className}`}>T</span>
      </div>
    </div>
  )
}