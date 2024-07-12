'use client'

import styles from "../page.module.css";
import React from 'react';
import Link from 'next/link'

const back_url = "http://127.0.0.1:5000";

export default function Home(){
    const [pack, setPack] = React.useState<any[]>([]);
    // async function getPacks(){
    //     try {
    //         const response = await fetch(`${back_url}/packages_sample`);
    //         if (!response.ok){
    //             throw new Error(`Response status: ${response.status}`);
    //         }
    //         const json = await response.json();
    //         console.log(json[0]);
    //         return json;
    //     } catch (error){
    //         if (error instanceof Error){
    //             console.error(error.message);
    //         }
    //     }
    // }
    React.useEffect(() => {
        const getPacks = async () => {
            try {
                const response = await fetch(`${back_url}/packages_sample`);
                if (!response.ok){
                    throw new Error(`Response status: ${response.status}`);
                }
                const json = await response.json();
                console.log(json[0]);
                setPack(json);
            } catch (error){
                if (error instanceof Error){
                    console.error(error.message);
                }
            }
        }
        getPacks();
    },[]);
    const toRender = pack.map((content) => 
        <div>
            <h2><Link href={"/packages/" + content.name}>{content.name}</Link></h2>
            <p>{content.description}</p>
            <p>{content.version_history[content.version_history.length-1]}</p>
        </div>
    );
    return (
        <main className={styles.main}>
            <div className={styles.center}>
                <h1>Browse For Packages</h1>
            </div>
            <div>
                {toRender}
            </div>
        </main>
    );
}