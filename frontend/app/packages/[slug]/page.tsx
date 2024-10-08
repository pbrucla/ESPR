'use client'

import fileDownload from "js-file-download";
import styles from "./page.module.css";
import React from 'react';

const back_url = "http://127.0.0.1:5000";

type Dependencies = {
  [key: string]: string[];
}

type Package = {
  name: string;
  author: string;
  versions: string[];
  dependencies: Dependencies;
  collaborators: string[];
  status: string;
  description: string;
}

export default function Page({ params }: { params: { slug: string } }) {
  const id: string = params.slug;

  const [pack, setPack] = React.useState<Package | null>();
  const [msg, setMsg] = React.useState<string | null>("Loading Packages...");

  
  React.useEffect(() => {
    const getPack = async () => {
        try {
            const response = await fetch(`${back_url}/package_info/${id}`);
            if (!response.ok){
                throw new Error(`Response status: ${response.status}`);
            }
            const json: Package = await response.json();
            setPack(json);
            setMsg(null);
        } catch (error){
            if (error instanceof Error){
                setMsg("Package not found");
                console.error(error.message);
                setPack(null);
            }
        }
    };
    getPack();
  },[id]);

  
  function downloadPack(package_name: string, address: string, version: string) {
    const url = `${back_url}/retrieve_package?package_address=${encodeURIComponent(address)}&version_number=${encodeURIComponent(version)}`;
    
    fetch(url).then((response) => {
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      return response.blob();
    }).then((blob) => {
      const filename = package_name;
      fileDownload(blob, filename);
    }).catch((err) => {
      console.error("There was a problem with downloading:", err.message);
    })
  }



  if (pack === null) {
    return (
      <main>
        <div className={styles.title}>
          <h1>{id}: Package not found</h1>
        </div>
      </main>
    );
  }

  if (msg === "Loading Packages...") {
    return (
      <main>
        <div className={styles.title}>
          <h1>{id}: Loading...</h1>
        </div>
      </main>
    );
  }

  const earliestVersion = pack?.versions[0];

  const versionHistory = (
    <div style={{lineHeight: "2.5"}}>
      <br></br>
      {pack?.versions.map((version: string) => (
        <div key={version} style={{display: "flex"}}>
          <br></br>
          <div className={styles.hoverContainer}>
            <p className={styles.hoverText}>{version}</p>
            <div className={styles.hoverMenu} style={version === earliestVersion ? {transform: "translateY(-100%)"} : {}}>
              {pack?.dependencies[version].map( (dep: string) =>
              // could link to package
                <a key={dep}>{dep}</a>
              )}
            </div>
          </div>
          <span style={{float: "right", padding: "10px"}}>
            <button className={styles.downloadButton} onClick = {() => downloadPack(pack?.name,id,version)}>Download</button>
          </span>
        </div>
      )).reverse()}
      <br></br>
    </div>
  );

  const collabs = pack?.collaborators.join(', ');

  const packInfo = (
    <main>
        <div style={{padding: "0 5rem"}}>
          <div style={{overflowWrap: "break-word", fontSize: "50px", fontWeight: "bold"}} className={styles.title}>
                    {pack?.name}
          </div>
          <div style={{display: "flex"}}>
            <div style={{position: "relative", width: "70vw"}}>
                <br></br>
                <div style={{overflowWrap: "break-word", fontSize: "30px"}}>
                  <b>AUTHOR:</b> {pack?.author}
                </div>
                <br></br>
                <div style={{overflowWrap: "break-word"}}>
                  <b style={{fontSize: "25px"}}>Collaborators:</b>  <p style={{fontSize: "15px"}}> {collabs} </p>
                </div>
                <br></br>
                <div style={{overflowWrap: "break-word", fontSize: "35px"}}>
                  <b>STATUS: <span style={pack?.status === "alive" ? {color: "green"} : {color: "red"}}>{pack?.status}</span></b>
                </div>
                <br></br>
                <div style={{overflowWrap: "break-word", fontSize: "30px"}}>
                  <b>Description:</b>
                </div>
                <div style={{overflowWrap: "break-word", fontSize: "20px"}}>
                  <p>{pack?.description}</p>
                </div>
            </div>
            <div style={{overflowWrap: "break-word"}}>
              <b style={{fontSize: "25px", marginRight: "5vw"}}>Version History</b>
              {versionHistory}
            </div>
          </div>
        </div>
    </main>
  );

  return packInfo;




}
