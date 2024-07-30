'use client'

import styles from "./page.module.css";
import React from 'react';

const back_url = "http://127.0.0.1:5000";


type Package = {
  name: string;
  description: string;
  version_history: string[];
}

export default function Page({ params }: { params: { slug: string } }) {
  const name = params.slug;

  const [pack, setPack] = React.useState<Package | null>();
  const [msg, setMsg] = React.useState<string | null>("Loading Challenges...");

  /*
  React.useEffect(() => {
    const getPack = async () => {
        try {
            const response = await fetch(`${back_url}/packages_sample`);
            if (!response.ok){
                throw new Error(`Response status: ${response.status}`);
            }
            const json: Package = await response.json();
            setPack(json);
            setLoadingMsg(null);
        } catch (error){
            if (error instanceof Error){
                setMsg("An unexpected error occurred");
                console.error(error.message);
            }
        }
    };
    getPack();
  },[]);
  */

  React.useEffect( () => {
    setPack({name: 'test_pack', description: 'test_desc', version_history: ['1','2','3'] });
    setMsg(null);
  }, [] );

  if (pack === null) {
    return (
      <main>
        <div className={styles.title}>
          <h1>{name}: Package not found</h1>
        </div>
      </main>
    );
  }

  if (msg === "Loading Challenges...") {
    return (
      <main>
        <div className={styles.title}>
          <h1>{name}: Loading...</h1>
        </div>
      </main>
    );
  }

  const packInfo = (
    <main>
        <div style={{padding: "0 5rem"}}>
          <div style={{overflowWrap: "break-word", fontSize: "50px", fontWeight: "bold"}} className={styles.title}>
                    {pack?.name}
          </div>
          <div style={{display: "flex"}}>
            <div style={{position: "relative", width: "70vw"}}>
                <br></br>
                <div style={{overflowWrap: "break-word", fontSize: "35px"}}>
                    <b>Description:</b>
                </div>
                <br></br>
                <div style={{overflowWrap: "break-word", fontSize: "25px"}}>{pack?.description}</div>
                <br></br>
            </div>
            <div style={{overflowWrap: "break-word"}}>
              <b style={{fontSize: "25px"}}>Version History</b>
              <div style={{lineHeight: "1.8"}}>
                1
                <br></br>
                2
              </div>
            </div>
          </div>
        </div>
    </main>
  );

  return packInfo;




}
