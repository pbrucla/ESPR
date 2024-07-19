import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className = {styles.topnav}>
        
        <a href="." className = {styles.active}> home </a>
        <a href="/browse/page.tsx"> browse </a>
        <a href="/packages/page.tsx"> packages </a>
        <input type="text" placeholder="Search.." />
      </div>
  );
}
