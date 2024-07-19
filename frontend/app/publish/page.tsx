'use client'

import React from 'react';
import styles from "../page.module.css";
const back_url = "http://127.0.0.1:5000";

export default function Home(){
    async function submitting(formData: FormData) {
        const priv = formData.get("priv");
        console.log(priv);
        //web3.js stuff
        try {
            const res = await fetch(
                `${back_url}/publish_package_sample`,
                {
                    method: 'POST',
                    body: formData,
                },
            );
        } catch (error) {
            if (error instanceof Error) {
                console.error(error.message);
            }
        }
    }
    return (
        <main>
            <div className={styles.title}>
                <h1>Publish a Package!</h1>
            </div>
            <div className={styles.basiccenter}>
                <form action={submitting}>
                    <div className={styles.basiccenter}>
                        <div>
                            <h3>Package Name</h3>
                            <input
                                name="name"
                                id="name"
                                type="text"
                                maxLength={40}
                            />
                        </div>
                        <div>
                            <h3>Version Number</h3>
                            <input
                                name="initial_version"
                                id="initial_version"
                                type="text"
                            />
                        </div>
                        <div>
                            <h3>Private Key</h3>
                            <p>Note: we do not store or send your private key over the web</p>
                            <input
                                name="priv"
                                id="priv"
                                type="text"
                            />
                        </div>
                        <div>
                            <h3>Package Description</h3>
                            <input
                                name="description"
                                id="description"
                                type="text"
                            />
                        </div>
                        <button type="submit">
                            Publish Package!
                        </button>
                    </div>
                </form>
            </div>
        </main>
    )
}