import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main>
      <div className={styles.paragraphBox}>
        <div>
        <h1>Want to start publishing your own packages?</h1>
        <p>
          Put your package on the blockchain today!
        </p>
       
        <a href="/publish/page.tsx">
        <button className = {styles.homepageButton}>
          Get started
        </button>
        </a>
        </div>
      </div>
      
      <div className={styles.paragraphBox}>
        <div>
        <h1>Interested in seeing the packages that others have published?</h1>
          <div className={styles.textAndImage}>
            <div className = {styles.textItem }>
              <p className = {styles.item} >
                Here are some of the packages that others have published
              </p>
              <a className={styles.item} href="/packages/page.tsx">
              <button className = {styles.buttonInItem}>
                Click here!
              </button>
            </a>
            </div>
            <div className = {styles.imageItem}>
              <p>
                placeholder.img
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
