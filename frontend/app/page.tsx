import styles from "./page.module.css";

export default function Home() {
  return (
    <main style={{padding: '2.5vw'}}>
      <div className={styles.titleparent}>
        <div className={styles.namedisplay}>
          <h1 className={styles.topnavbrand}><span className={styles.big}>ESPR ✨</span></h1>
        </div>
        <div style={{width:'5vw'}}/>
        <div className={styles.homepagetext}>
          <h2 style={{margin: '20px', color: '#F44D8A', fontSize: '2em'}}>The Package Manager, Re-imagined</h2>
          <br />
          <p style={{fontSize: '1.5em'}}>ESPR, or the Ethereum-Source Package Repository, is an innovative new take on the traditional package manager aiming to improve security. Packages on ESPR have their information stored on the Ethereum blockchain, while the files are stored in an IPFS distributed filesystem. ESPR doesn't require any accounts, just an Ethereum wallet.</p>
        </div>
      </div>
      <div className={styles.titleparent} style={{padding: '1vw', border: 'none', margin: 'auto'}}>
        <div className={styles.namedisplay} style={{width: '47.5vw'}}>
          <a href="/browse">
            <button className={styles.navbutton}>
              <h1>Interested in seeing the packages that others have published?</h1>
            </button>
          </a>
        </div>
        
        <div className={styles.namedisplay} style={{width: '47.5vw'}}>
          <a href='/publish'>
            <button className={styles.navbutton}>
              <h1>Put Your Package on the Blockchain Today!</h1>
            </button>
          </a>
        </div>
      </div>
    </main>
    // <main>
    //   <div className={styles.paragraphBox}>
    //     <div>
    //     <h1>Want to start publishing your own packages?</h1>
    //     <p>
    //       Put your package on the blockchain today!
    //     </p>
       
    //     <a href="/publish/">
    //     <button className = {styles.homepageButton}>
    //       Get started
    //     </button>
    //     </a>
    //     </div>
    //   </div>
      
    //   <div className={styles.paragraphBox}>
    //     <div>
    //     <h1>Interested in seeing the packages that others have published?</h1>
    //       <div className={styles.textAndImage}>
    //         <div className = {styles.textItem }>
    //           <p className = {styles.item} >
    //             Here are some of the packages that others have published
    //           </p>
    //           <a className={styles.item} href="/browse">
    //           <button className = {styles.buttonInItem}>
    //             Click here!
    //           </button>
    //         </a>
    //         </div>
    //         <div className = {styles.imageItem}>
    //           <p>
    //             placeholder.img
    //           </p>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </main>
  );
}
