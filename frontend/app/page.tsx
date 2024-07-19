import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main>
      <div className={styles.paragraphBox}>
        <div>
        <h1>PACKAGES ARE BLOCKS AND THEREFORE PACKAGES SHOULD GO ON THE BLOCKCHAIN</h1>
        <p>
          put your package on the blockchain now
        </p>
       
        <a  href="/login/page.tsx">
        <button className = {styles.homepageButton}>
          Get started
        </button>
        </a>
        </div>
      </div>
      
      <div className={styles.paragraphBox}>
        <div>
        <h1>NOT INTERESTED IN GETTING STARTED?</h1>
        <a  href="/packages/page.tsx">
        <button className = {styles.homepageButton}>
          CLICK IF PRO
        </button>
        </a>
        </div>
      </div>
    </main>
  );
}
